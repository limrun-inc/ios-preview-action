"use strict";
exports.id = 475;
exports.ids = [475];
exports.modules = {

/***/ 6475:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {




if (process.env.NODE_ENV === 'production') {
  module.exports = __webpack_require__(9269)
} else {
  module.exports = __webpack_require__(7178)
}


/***/ }),

/***/ 7178:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function _loadWasmModule (sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

    if (imports) {
      return instantiateFunc(source, imports)
    } else {
      return compileFunc(source)
    }
  }

  
var buf = null;
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (filepath && isNode) {
  
var fs = __webpack_require__(9896);
var path = __webpack_require__(6928);

return new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname, filepath), (error, buffer) => {
    if (error != null) {
      reject(error);
    } else {
      resolve(_instantiateOrCompile(buffer, imports, false));
    }
  });
});

} else if (filepath) {
  
return _instantiateOrCompile(fetch(filepath), imports, true);

}

if (isNode) {
  
buf = Buffer.from(src, 'base64');

} else {
  
var raw = globalThis.atob(src);
var rawLength = raw.length;
buf = new Uint8Array(new ArrayBuffer(rawLength));
for(var i = 0; i < rawLength; i++) {
   buf[i] = raw.charCodeAt(i);
}

}


  if(sync) {
    var mod = new WebAssembly.Module(buf);
    return imports ? new WebAssembly.Instance(mod, imports) : mod
  } else {
    return _instantiateOrCompile(buf, imports, false)
  }
}

function wasm(imports){return _loadWasmModule(0, 'df58e7ef369c5c18.wasm', null, imports)}

exports.xd3_smatch_cfg = void 0;
(function (xd3_smatch_cfg) {
  xd3_smatch_cfg[xd3_smatch_cfg["DEFAULT"] = 0] = "DEFAULT";
  xd3_smatch_cfg[xd3_smatch_cfg["SLOW"] = 1] = "SLOW";
  xd3_smatch_cfg[xd3_smatch_cfg["FAST"] = 2] = "FAST";
  xd3_smatch_cfg[xd3_smatch_cfg["FASTER"] = 3] = "FASTER";
  xd3_smatch_cfg[xd3_smatch_cfg["FASTEST"] = 4] = "FASTEST";
  xd3_smatch_cfg[xd3_smatch_cfg["SOFT"] = 5] = "SOFT";
})(exports.xd3_smatch_cfg || (exports.xd3_smatch_cfg = {}));
exports.WASI_ERRNO = void 0;
(function (WASI_ERRNO) {
  WASI_ERRNO[WASI_ERRNO["SUCCESS"] = 0] = "SUCCESS";
  WASI_ERRNO[WASI_ERRNO["ENOMEM"] = 48] = "ENOMEM";
  WASI_ERRNO[WASI_ERRNO["ENOSPC"] = 51] = "ENOSPC";
})(exports.WASI_ERRNO || (exports.WASI_ERRNO = {}));
var initPromise = /*#__PURE__*/wasm({});
var init = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return initPromise;
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function init() {
    return _ref.apply(this, arguments);
  };
}();
var _w;
initPromise.then(function (w) {
  _w = w;
});
var _memory_view;
var exports$1 = /*#__PURE__*/new Proxy({}, {
  get: function get(_, prop) {
    var _memory_view2;
    if (!_w) throw new Error("WASM not initialized - await init() first");
    return prop === "memory_view" ? (_memory_view2 = _memory_view) != null ? _memory_view2 : _memory_view = new DataView(_w.instance.exports["memory"].buffer) : _w.instance.exports[prop];
  }
});
var writeToMemoryAt = function writeToMemoryAt(ptr, data) {
  new Uint8Array(exports$1.memory.buffer, ptr, data.byteLength).set(data);
};
var readFromMemoryAt = function readFromMemoryAt(ptr, length) {
  return new Uint8Array(exports$1.memory.buffer, ptr, length);
};
var readCStrAt = function readCStrAt(ptr) {
  var b = ptr;
  for (; exports$1.memory_view.getUint8(b) !== 0; b++) {}
  return new TextDecoder().decode(new Uint8Array(exports$1.memory.buffer, ptr, b - ptr));
};
var getCodeStr = function getCodeStr(code) {
  return code in exports.WASI_ERRNO ? exports.WASI_ERRNO[code] : readCStrAt(exports$1.xd3_strerror(code));
};
// the function signatures for xd3_encode_memory and xd3_decode_memory are identical, which is very helpful for us
// however we want to always pass 0 to the flags arg for decoding
var makeWrappedXD3Fn = function makeWrappedXD3Fn(xd3_fn_name) {
  return function (input, source, output_size_max, smatch_cfg) {
    var malloc = exports$1.malloc,
      free = exports$1.free,
      memory_view = exports$1.memory_view;
    var xd3_fn = exports$1[xd3_fn_name];
    var input_ptr = malloc(input.byteLength);
    var source_ptr = malloc(source.byteLength);
    var output_ptr = malloc(output_size_max);
    var output_size_ptr = malloc(4);
    writeToMemoryAt(input_ptr, input);
    writeToMemoryAt(source_ptr, source);
    var ret = xd3_fn(input_ptr, input.byteLength, source_ptr, source.byteLength, output_ptr, output_size_ptr, output_size_max, smatch_cfg);
    var output_size = memory_view.getUint32(output_size_ptr, true);
    // copy output to new arraybuffer
    var output = new Uint8Array(output_size);
    output.set(readFromMemoryAt(output_ptr, output_size));
    // free memory
    free(input_ptr);
    free(source_ptr);
    free(output_ptr);
    free(output_size_ptr);
    return {
      ret: ret,
      str: getCodeStr(ret),
      output: output
    };
  };
};
/**
 * Create a delta of the `input` relative to the `source`.
 * @param input Input data to create a delta of
 * @param source Source/"dictionary" the input is compared to
 * @param output_size_max Maximum size, in bytes, of the resulting delta. If the delta would be larger than this value, the function will return with the error `ENOSPC` and an empty buffer.
 * @param smatch_cfg The string matching configuration to use
 * @returns An object containing the return code, a string representation of the return code, and the resulting bytes of the delta
 */
var xd3_encode_memory = /*#__PURE__*/makeWrappedXD3Fn("xd3_encode_memory");
var _xd3_decode_memory = /*#__PURE__*/makeWrappedXD3Fn("xd3_decode_memory");
/**
 * Decode a delta created relative to the `source`.
 * @param input Delta data to decode
 * @param source Source/"dictionary" the delta is relative to. This is the same `source` as used in encoding
 * @param output_size_max Maximum size, in bytes, of the resulting decoded data. If the decoded data would be larger than this value, the function will return with the error `ENOSPC` and an empty buffer.
 * @returns An object containing the return code, a string representation of the return code, and the resulting bytes of the decoded data
 */
var xd3_decode_memory = function xd3_decode_memory(input, source, output_size_max) {
  return _xd3_decode_memory(input, source, output_size_max, 0);
};

exports.init = init;
exports.xd3_decode_memory = xd3_decode_memory;
exports.xd3_encode_memory = xd3_encode_memory;
//# sourceMappingURL=xdelta3-wasm.cjs.development.js.map


/***/ }),

/***/ 9269:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

function t(){t=function(){return e};var e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var i=Object.create((e&&e.prototype instanceof p?e:p).prototype),a=new O(n||[]);return o(i,"_invoke",{value:E(t,r,a)}),i}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var h={};function p(){}function v(){}function y(){}var d={};s(d,a,(function(){return this}));var m=Object.getPrototypeOf,g=m&&m(m(A([])));g&&g!==r&&n.call(g,a)&&(d=g);var w=y.prototype=p.prototype=Object.create(d);function x(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function b(t,e){function r(o,i,a,c){var u=l(t[o],t,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==typeof f&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function E(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=_(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=l(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}function _(t,e){var r=e.method,n=t.iterator[r];if(void 0===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=void 0,_(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),h;var o=l(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,h;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function A(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:T}}function T(){return{value:void 0,done:!0}}return v.prototype=y,o(w,"constructor",{value:y,configurable:!0}),o(y,"constructor",{value:v,configurable:!0}),v.displayName=s(y,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,s(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},e.awrap=function(t){return{__await:t}},x(b.prototype),s(b.prototype,c,(function(){return this})),e.AsyncIterator=b,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new b(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},x(w),s(w,u,"Generator"),s(w,a,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=A,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(S),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),u=n.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),S(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:A(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},e}function e(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function r(t){return function(){var r=this,n=arguments;return new Promise((function(o,i){var a=t.apply(r,n);function c(t){e(a,o,i,c,u,"next",t)}function u(t){e(a,o,i,c,u,"throw",t)}c(void 0)}))}}function n(t){return function(t,e,r,n){function o(t,e,r){var n=r?WebAssembly.instantiateStreaming:WebAssembly.instantiate,o=r?WebAssembly.compileStreaming:WebAssembly.compile;return e?n(t,e):o(t)}var i=null,a="undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node;if(e&&a){var c=__webpack_require__(9896),u=__webpack_require__(6928);return new Promise(((t,r)=>{c.readFile(u.resolve(__dirname,e),((e,i)=>{null!=e?r(e):t(o(i,n,!1))}))}))}if(e)return o(fetch(e),n,!0);if(a)i=Buffer.from(null,"base64");else{var s=globalThis.atob(null),f=s.length;i=new Uint8Array(new ArrayBuffer(f));for(var l=0;l<f;l++)i[l]=s.charCodeAt(l)}return o(i,n,!1)}(0,"df58e7ef369c5c18.wasm",0,t)}var o,i;Object.defineProperty(exports, "__esModule", ({value:!0})),exports.xd3_smatch_cfg=void 0,(o=exports.xd3_smatch_cfg||(exports.xd3_smatch_cfg={}))[o.DEFAULT=0]="DEFAULT",o[o.SLOW=1]="SLOW",o[o.FAST=2]="FAST",o[o.FASTER=3]="FASTER",o[o.FASTEST=4]="FASTEST",o[o.SOFT=5]="SOFT",exports.WASI_ERRNO=void 0,(i=exports.WASI_ERRNO||(exports.WASI_ERRNO={}))[i.SUCCESS=0]="SUCCESS",i[i.ENOMEM=48]="ENOMEM",i[i.ENOSPC=51]="ENOSPC";var a,c,u=n({}),s=function(){var e=r(t().mark((function e(){return t().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u;case 2:case"end":return t.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();u.then((function(t){a=t}));var f=new Proxy({},{get:function(t,e){var r;if(!a)throw new Error("WASM not initialized - await init() first");return"memory_view"===e?null!=(r=c)?r:c=new DataView(a.instance.exports.memory.buffer):a.instance.exports[e]}}),l=function(t,e){new Uint8Array(f.memory.buffer,t,e.byteLength).set(e)},h=function(t){return function(e,r,n,o){var i=f.malloc,a=f.free,c=f.memory_view,u=f[t],s=i(e.byteLength),h=i(r.byteLength),p=i(n),v=i(4);l(s,e),l(h,r);var y,d=u(s,e.byteLength,h,r.byteLength,p,v,n,o),m=c.getUint32(v,!0),g=new Uint8Array(m);return g.set(new Uint8Array(f.memory.buffer,p,m)),a(s),a(h),a(p),a(v),{ret:d,str:(y=d,y in exports.WASI_ERRNO?exports.WASI_ERRNO[y]:function(t){for(var e=t;0!==f.memory_view.getUint8(e);e++);return(new TextDecoder).decode(new Uint8Array(f.memory.buffer,t,e-t))}(f.xd3_strerror(y))),output:g}}},p=h("xd3_encode_memory"),v=h("xd3_decode_memory");exports.init=s,exports.xd3_decode_memory=function(t,e,r){return v(t,e,r,0)},exports.xd3_encode_memory=p;
//# sourceMappingURL=xdelta3-wasm.cjs.production.min.js.map


/***/ })

};
;
//# sourceMappingURL=475.index.js.map