/*AutoCompleteEmail has been derived from http://www.primefaces.org/primeng/#/autocomplete*/
import {
  Component,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  DoCheck,
  Input,
  Output,
  EventEmitter,
  IterableDiffers,
  Renderer,
  forwardRef,
  NgModule
} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {DomHandler} from "./domhandler";
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutoComplete),
  multi: true
};

@Component({
  selector: 'autoComplete-email',
  template: `
    <span [ngClass]="{'ui-autocomplete':true}" [ngStyle]="style" [class]="styleClass">
      <ion-item><ion-input clearOnEdit clearInput type="email" [ngStyle]="inputStyle" [class]="inputStyleClass" autocomplete="off"
        [value]="value ? value : null" (input)="onInput($event)"  (focus)="onFocus()"
        [placeholder]="placeholder" [attr.size]="size" [attr.maxlength]="maxlength" [attr.readonly]="readonly"
        [ngClass]=""></ion-input></ion-item>
      <div class="ui-autocomplete-panel" [style.display]="panelVisible ? 'block' : 'none'" [style.width]="appendTo ? 'auto' : '100%'" [style.max-height]="scrollHeight">
        <ul class="ui-autocomplete-list ui-widget-content">
          <li *ngFor="let option of suggestions" [ngClass]="{'ui-autocomplete-list-item ui-corner-all':true}"
             (click)="selectItem(option)">
            <span>{{field ? option[field] : option}}</span>
          </li>
        </ul>
      </div>
    </span>
    `,
  providers: [DomHandler, AUTOCOMPLETE_VALUE_ACCESSOR],
})
export class AutoComplete implements AfterViewInit,DoCheck,AfterViewChecked,ControlValueAccessor {

  @Input() minLength: number = 1;

  @Input() delay: number = 300;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() inputStyle: any;

  @Input() inputStyleClass: string;

  @Input() placeholder: string;

  @Input() readonly: number;

  @Input() maxlength: number;

  @Input() size: number;

  @Input() suggestions: any[];

  @Input() appendTo: any;

  @Output() completeMethod: EventEmitter<any> = new EventEmitter();

  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  @Input() field: string;

  @Input() scrollHeight: string = '200px';

  value: any;

  onModelChange: Function = () => {};

  onModelTouched: Function = () => {};

  timeout: any;

  differ: any;

  panel: any;

  input: any;

  panelVisible: boolean = false;

  documentClickListener: any;

  suggestionsUpdated: boolean;

  focus: boolean = false;

  filled: boolean;

  constructor(public el: ElementRef, public domHandler: DomHandler, differs: IterableDiffers, public renderer: Renderer) {
    this.differ = differs.find([]).create(null);
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.suggestions);
    if(changes && this.panel) {
      if(this.suggestions && this.suggestions.length) {
        this.show();
        this.suggestionsUpdated = true;
      }
      else {
        this.hide();
      }
    }
  }

  ngAfterViewInit() {
    this.input = this.domHandler.findSingle(this.el.nativeElement, 'input');
    this.panel = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-autocomplete-panel');

    this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
      this.hide();
    });

    if(this.appendTo) {
      if(this.appendTo === 'body')
        document.body.appendChild(this.panel);
      else
        this.domHandler.appendChild(this.panel, this.appendTo);
    }
  }

  ngAfterViewChecked() {
    if(this.suggestionsUpdated) {
      this.align();
      this.suggestionsUpdated = false;
    }
  }

  writeValue(value: any) : void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  onInput(event) {
    let value = event.target.value;
    this.value = value;
    this.onModelChange(value);

    if(value.length === 0) {
      this.hide();
    }

    if(value.length > this.minLength) {
      //Cancel the search request if user types within the timeout
      if(this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.search(event, value);
      }, this.delay);
    }
  }

  search(event: any, query: string) {
    //allow empty string but not undefined or null
    if(query === undefined || query === null) {
      return;
    }

    this.completeMethod.emit({
      originalEvent: event,
      query: query
    });
  }

  selectItem(option: any) {
    this.input.value = option.name;
    this.value = option.name;

    this.onModelChange(this.value);
    this.onSelect.emit(option.name);
    this.input.focus();
  }

  show() {
    if(!this.panelVisible && (this.focus)) {
      this.panelVisible = true;
      this.panel.style.zIndex = ++DomHandler.zindex;
      this.domHandler.fadeIn(this.panel, 200);
    }
  }

  align() {
    if(this.appendTo)
      this.domHandler.absolutePosition(this.panel, this.input);
    else
      this.domHandler.relativePosition(this.panel, this.input);
  }

  hide() {
    this.panelVisible = false;
  }

  onFocus() {
    this.focus = true;
  }

  ngOnDestroy() {
    if(this.documentClickListener) {
      this.documentClickListener();
    }

    if(this.appendTo) {
      this.el.nativeElement.appendChild(this.panel);
    }
  }
}

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: [AutoComplete],
  declarations: [AutoComplete]
})
export class AutoCompleteModule { }
