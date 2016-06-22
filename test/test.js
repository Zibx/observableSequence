/**
 * Created by zibx on 22.06.16.
 */
var assert = require('chai').assert;
var seq = require('../observableSequence');
describe('basic tests', function (){
    'use strict';
    it( 'should creates new', function(){
        var s = new seq([]);
        assert.equal(s.length, 0);
    } );
    var pushed;
    it( '#push', function(){
        var s = pushed = new seq([]);
        s.push(1);
        s.push(2);
        s.push(3);
        assert.equal(s.length, 3);
        assert.equal( s.get(0), 1);
        assert.equal( s.get(1), 2);
        assert.equal( s.get(2), 3);
        assert.equal( s.get(3), void 0);

    });
    it( '#pop', function(){
        var s = pushed;
        assert.equal( s.pop(), 3);
        assert.equal(s.length, 2);
        assert.equal( s.get(0), 1);
        assert.equal( s.get(1), 2);
        assert.equal( s.get(2), void 0);
    });
    it( '#unshift', function(){
        var s = pushed;
        assert.equal( s.unshift(8), 3);
        assert.equal(s.length, 3);
        assert.equal( s.get(0), 8);
        assert.equal( s.get(1), 1);
        assert.equal( s.get(2), 2);
        assert.equal( s.get(3), void 0);
    });
    it( '#shift', function(){
        var s = pushed;
        assert.equal( s.shift(), 8);
        assert.equal(s.length, 2);
        assert.equal( s.get(0), 1);
        assert.equal( s.get(1), 2);
        assert.equal( s.get(2), void 0);
    });
    it( '#toArray', function(){
        var s = pushed;
        assert.deepEqual( s.toArray(), [1,2]);
    });
    it( '#indexOf', function(){
        var s = pushed;
        assert.equal( s.indexOf(2), 1);
        assert.equal( s.indexOf(1), 0);
        assert.equal( s.indexOf(17), -1);
    });
    it( '#splice', function(){
        var s = pushed;
        s.splice(1,0,1.5);
        assert.equal( s.length, 3);
        assert.equal( s.get(0), 1);
        assert.equal( s.get(1), 1.5);
        assert.equal( s.indexOf(1.5), 1);
        assert.equal( s.get(2), 2);
        assert.deepEqual(s.splice(1, 1,  1.2, 1.4, 1.6, 1.8), [1.5]);

        assert.equal( s.length, 6);
    });
    it( '#set', function(){
        var s = pushed;
        assert.equal( s.set(1, 1.3), 1.2);
        assert.equal( s.get(1), 1.3);

        assert.equal( s.set(6, 3), void 0);
        assert.equal( s.get(6), 3);
    });
    it( '#forEach', function(){
        var s = new seq([1,2,3,4,5] ), j = 0;
        s.forEach( function( el,i ){
            assert.equal( el, i+1 );
            assert.equal( i, j);
            j++;
        });
    });
});