import {Component, ElementRef, AfterViewInit, AfterViewChecked, DoCheck, Input, Output, EventEmitter, IterableDiffers, Renderer, forwardRef} from '@angular/core';
import {DomHandler} from '../../../shared/components/autoCompleteEmail/domhandler';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutoComplete),
  multi: true
};

@Component({
  selector: 'autoComplete-email',
  template: `
    <span [ngClass]="{'ui-autocomplete':true,'ui-autocomplete-dd':dropdown}" [ngStyle]="style" [class]="styleClass">
      <ion-item><ion-input clearOnEdit clearInput type="email" [ngStyle]="inputStyle" [class]="inputStyleClass" autocomplete="off"
        [value]="value ? value : null" (input)="onInput($event)" (keydown)="onKeydown($event)" (focus)="onFocus()" (blur)="onBlur()"
        [placeholder]="placeholder" [attr.size]="size" [attr.maxlength]="maxlength" [attr.readonly]="readonly" [disabled]="disabled"
        [ngClass]="{'ui-autocomplete-input':true,'ui-autocomplete-dd-input':dropdown}"
        ></ion-input></ion-item>
      <div class="ui-autocomplete-panel" [style.display]="panelVisible ? 'block' : 'none'" [style.width]="appendTo ? 'auto' : '100%'" [style.max-height]="scrollHeight">
        <ul class="ui-autocomplete-list ui-widget-content">
          <li *ngFor="let option of suggestions" [ngClass]="{'ui-autocomplete-list-item ui-corner-all':true,'ui-state-highlight':(highlightOption==option)}"
            (mouseenter)="highlightOption=option" (mouseleave)="highlightOption=null" (click)="selectItem(option)">
            <span>{{field ? option[field] : option}}</span>
          </li>
        </ul>
      </div>
    </span>
    `,
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [DomHandler,AUTOCOMPLETE_VALUE_ACCESSOR],
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
        
  @Input() disabled: boolean;
    
  @Input() maxlength: number;
    
  @Input() size: number;
    
  @Input() suggestions: any[];

  @Input() appendTo: any;

  @Output() completeMethod: EventEmitter<any> = new EventEmitter();
    
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
    
  @Output() onUnselect: EventEmitter<any> = new EventEmitter();
    
  @Output() onDropdownClick: EventEmitter<any> = new EventEmitter();
    
  @Input() field: string;
    
  @Input() scrollHeight: string = '200px';
    
  @Input() dropdown: boolean;
    
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
    
  highlightOption: any;
    
  highlightOptionChanged: boolean;
    
  focus: boolean = false;
    
  dropdownFocus: boolean = false;
    
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
        
    if(this.highlightOptionChanged) {
      let listItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
      if(listItem) {
        this.domHandler.scrollInView(this.panel, listItem);
      }
      this.highlightOptionChanged = false;
    }
  }
    
  writeValue(value: any) : void {
    this.value = value;
    this.filled = this.value && this.value != '';
  }
    
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
    
  setDisabledState(val: boolean): void {
    this.disabled = val;
  }

  onInput(event) {
    let value = event.target.value;
    this.value = value;
    this.onModelChange(value);
  
    if(value.length === 0) {
      this.hide();
    }
        
    if(value.length >= this.minLength) {
      //Cancel the search request if user types within the timeout
      if(this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.search(event, value);
        }, this.delay);
    }
    else {
      this.suggestions = null;
    }
    this.updateFilledState();
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
    
  handleDropdownClick(event) {
    this.onDropdownClick.emit({
      originalEvent: event,
      query: this.input.value
    });
  }
    
  removeItem(item: any) {
    let itemIndex = this.domHandler.index(item);
    let removedValue = this.value.splice(itemIndex, 1)[0];
    this.onUnselect.emit(removedValue);
    this.onModelChange(this.value);
  }
    
  onKeydown(event) {
    if(this.panelVisible) {
      let highlightItemIndex = this.findOptionIndex(this.highlightOption);
            
      switch(event.which) {
        //down
        case 40:
          if(highlightItemIndex != -1) {
            var nextItemIndex = highlightItemIndex + 1;
            if(nextItemIndex != (this.suggestions.length)) {
              this.highlightOption = this.suggestions[nextItemIndex];
              this.highlightOptionChanged = true;
            }
          }
          else {
            this.highlightOption = this.suggestions[0];
          }

          event.preventDefault();
          break;
        //up
        case 38:
          if(highlightItemIndex > 0) {
            let prevItemIndex = highlightItemIndex - 1;
            this.highlightOption = this.suggestions[prevItemIndex];
            this.highlightOptionChanged = true;
          }
                    
          event.preventDefault();
          break;
                
        //enter
        case 13:
          if(this.highlightOption) {
            //console.log("key enter")
            this.selectItem(this.highlightOption);
            this.hide();
          }
          event.preventDefault();
          break;

          //escape
          case 27:
            this.hide();
            event.preventDefault();
            break;

          //tab
          case 9:
            if(this.highlightOption) {
              this.selectItem(this.highlightOption);
            }
            this.hide();
            break;
      } 
    } 
    else {
      if(event.which === 40 && this.suggestions) {
      this.search(event,event.target.value);
      }
    }
  }
    
  onFocus() {
    this.focus = true;
  }
    
  onBlur() {
    this.focus = false;
    this.onModelTouched();
  }
    
  onDropdownFocus() {
    this.dropdownFocus = true;
  }
    
  onDropdownBlur() {
    this.dropdownFocus = false;
  }
    
  isSelected(val: any): boolean {
    let selected: boolean = false;
    if(this.value && this.value.length) {
      for(let i = 0; i < this.value.length; i++) {
        if(this.domHandler.equals(this.value[i], val)) {
          selected = true;
          break;
        }
      }
    }
    return selected;
  }
    
  findOptionIndex(option): number {        
    let index: number = -1;
    if(this.suggestions) {
      for(let i = 0; i < this.suggestions.length; i++) {
        if(this.domHandler.equals(option, this.suggestions[i])) {
          index = i;
          break;
        }
      }
    } 

    return index;
  }
    
  updateFilledState() {
    this.filled = this.input && this.input.value != '';
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

export class AutoCompleteModule { }