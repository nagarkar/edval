import {CircularList} from "./circular.list";

describe('Circular List Tests', () => {
  it('Length one list', ()=> {
    let list: CircularList<string> = new CircularList<string>(1);
    list.add('one');
    list.forEach((value: string, index: number)=> {
      expect(value).toEqual('one');
      expect(index).toEqual(0);
    })
    list.add('two');
    list.forEach((value: string, index: number)=> {
      expect(value).toEqual('two');
      expect(index).toEqual(0);
    })
  })

  it('Length two list', ()=> {
    let list: CircularList<string> = new CircularList<string>(2);
    list.add('one').add('two');
    list.forEach((value: string, index: number)=> {
      expect(index == 1 || index == 0).toBeTruthy();
      if (index == 0) {
        expect(value).toEqual('one');
      } else {
        expect(value).toEqual('two');
      }
    })
    list.add('two');
    list.forEach((value: string, index: number)=> {
      expect(index == 1 || index == 0).toBeTruthy();
      expect(value).toEqual('two');
    })
  })

  let checkList= (list: CircularList<string>, expected: string[]) => {
    let cnt = 0;
    list.forEach((value)=> {
      expect(value).toEqual(expected[cnt]);
    });
    //Set<string>
  }

  it('List Iterator', ()=> {
    let list: CircularList<string> = new CircularList<string>(3);
    list.add('one').add('two').add('three');
    checkList(list, [
      'one', 'two', 'three'
    ]);
    list.add('four');
    checkList(list, [
      'two', 'three', 'four'
    ]);
  });

});
