/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 2015
module.exports = (function () {
    'use strict';
    var Iterator = function( obj, start ){
        this.obj = obj;
        this.pointer = start === void 0 ? -1 : start;
    };
    Iterator.prototype = {
        get: function(){
            return this.obj.get(this.pointer);
        },
        home: function(){
            this.pointer = -1;
        },
        end: function(){
            this.pointer = this.obj.length;
        },
        next: function(){
            this.pointer++;
            return this.get();
        },
        prev: function(){
            this.pointer--;
            return this.get();
        },
        last: function(){
            return this.pointer === this.obj.length - 1;
        },
        remove: function(){
            this.obj.splice(this.pointer, 1);
        }
    };
    var getter = function( i ){
        return this[i];
    };
    var fns = Array.prototype;
    /*
    @arg arr<ArrayInterface>: arr object must support push, pop, shift, unshift and splice operations. arr may support indexOf
     */
    var ObservableArray = function (arr){
        this.listeners = {};
        this._arr = arr;//[];
        if( !('get' in arr) ){
            Object.defineProperties( arr, {
                get: { value: getter, enumerable: false }
            } );
        }
        this.length = this._arr.length;
    };
    ObservableArray.prototype = {
        length: 0,
        indexOf: function (a) {
            return this._arr.indexOf(a);
        },
        toArray: function () {
            return this._arr;
        },
        _fireAdd: function (item, pos) {
            var arr = this._arr;
            this.fire('add', item, pos > 0 ? arr.get(pos-1) : null, pos < this.length - 1 ? arr.get(pos+1) : null, pos)
        },
        _fireRemove: function (item, pos) {
            var arr = this._arr;
            this.fire('remove', item, pos > 0 ? arr.get(pos-1) : null, pos < this.length ? arr.get(pos) : null, pos)
        },
        push: function (item) {
            // single item push only
            var out = this._arr.push(item);
            this._fireAdd(item, this.length++);
            return out;
        },
        unshift: function (item) {
            // single item unshift only
            var out = this._arr.unshift(item);
            this.length++;
            this._fireAdd(item, 0);
            return out;
        },
        shift: function(){
            var pos = --this.length,
                arr = this._arr,
                item = arr.shift();

            this._fireRemove(item, 0);
            return item;
        },
        pop: function () {
            var pos = --this.length,
                arr = this._arr,
                item = arr.pop();

            this._fireRemove(item, pos);
            return item;
        },
        fire: function (evt) {
            var listeners = this.listeners[evt], i, _i, args;
            if(!listeners)
                return;

            args = fns.slice.call(arguments,1);
            for( i = 0, _i = listeners.length; i < _i; i++ )
                listeners[i].apply( this, args );
        },
        on: function (evt, fn) {
            var tmp = this.listeners;
            (tmp[evt] = tmp[evt] || []).push(fn);
        },
        splice: function(start, count){
            var i, _i, newItems = fns.slice.call(arguments,2 ), out = [];
            for(i = 0;i<count; i++)
                out.push(this.remove(start));

            for(i = 0, _i = newItems.length; i < _i; i++)
                this.insert(newItems[i], i + start);

            return out;
        },
        /*
        set - updates element
        @arg pos: position of element. defined on [0..length]
        @arg item: element to set

        @return element that was in that position before
         */
        set: function(pos, item){
            if(pos === this.length){
                this.push( item );
                return void 0; // for same behavior we return empty array
            }
            return this.splice(pos, 1, item)[0];
        },
        iterator: function(start){
            return new Iterator(this, start);
        },
        get: function (pos) {
            return this._arr.get(pos);
        },
        remove: function(pos){
            var item = this._arr.splice(pos,1)[0];
            this.length--;
            this._fireRemove(item, pos);
            return item;
        },
        insert: function(item, pos){
            this._arr.splice(pos, 0, item);
            this.length++;
            this._fireAdd(item, pos)
        },
        forEach: function (fn) {
            return this._arr.forEach(fn);
        }
    };
    return ObservableArray;
})();