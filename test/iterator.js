/**
 * Created by zibx on 22.06.16.
 */
var assert = require('chai').assert;
var seq = require('../observableSequence');
describe('iterate', function (){
    'use strict';

    it('iterate', function(){
        var s = new seq([1,2,3,4,5]);
        var i = s.iterator(), j = 1, item;
        while( item = i.next())
            assert.equal(item, j++);
    });
    it('remove', function(){
        var s = new seq([1,2,3,4,5]);
        var i = s.iterator(), j = 1, item;
        while( item = i.next())
            item === 3 && i.remove();

        i = s.iterator();
        while( item = i.next()){
            assert.equal( item, j++ );
            if(j===3) j++;
        }
    });
});