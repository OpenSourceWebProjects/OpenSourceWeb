function a() {
    var _bind = Function.prototype.apply.bind(Function.prototype.bind);
Object.defineProperty(Function.prototype, 'bind', {
    value: function(obj) {
        var boundFunction = _bind(this, arguments);
        boundFunction.boundObject = obj;
        return boundFunction;
    }
});
    function memo(f) {
        if (!(f instanceof Function)) throw TypeError('Argument is not an instance of Function.');

        // Generate random variable names
        // to avoid conflicts with unknown
        // source code
        function randomKey(numBytes = 8) {
            let ranges = [
                [48, 10],
                [65, 26],
                [97, 26],
            ];
            let key = '_';

            for (let i = 0; i < numBytes; i++) {
                let idx = Math.floor(Math.random() * ranges.length);
                key += String.fromCharCode(ranges[idx][0] + Math.random() * ranges[idx][1]);
            }

            return key;
        }

        let fName = f.name;
        let boundObject;
        let fCode;

        const nativeCodeStr = '(){[nativecode]}';

        // Possible Proxy
        try {
            fCode = f.toString();
        } catch (error) {
            if (error.constructor == TypeError) {
                if (Function(`return ${fName}.toString()`)() != nativeCodeStr) {
                    throw TypeError(
                        `Possible Proxy detected: function has a name but no accessible source code. Consider memoizing the target function, ${fName}.`
                    );
                } else {
                    throw TypeError(
                        `Function has a name but no accessible source code. Applying toString() to its name, ${fName}, returns '[native code]'.`
                    );
                }
            } else {
                throw Error('Unexpected error calling toString on the argument.');
            }
        }

        if (!fName) {
            throw Error('Function name is falsy.');

            // Bound functions
            // Assumes we've monkey-patched
            // Function.prototype.bind previously
        } else if (fCode.replace(/^[^(]+|\s+/g, '') == nativeCodeStr) {
            if (/^bound /.test(fName)) {
                fName = fName.substr(6);
                boundObject = f.boundObject;
                // Bound functions return '[native code]' for
                // their toString method call so get the code
                // from the original function.
                console.log("aaaa",fName,boundObject)
                fCode = Function(`return ${fName}.toString()`)();
            } else {
                throw Error("Cannot access source code, '[native code]' provided.");
            }
        }

        const fNameRegex = new RegExp('(\\W)' + fName + '(\\W)', 'g');
        const cacheName = randomKey();
        const recursionName = randomKey();
        const keyName = randomKey();

        console.log(fCode)
        fCode = fCode
            .replace(/[^\(]+/, '')
            .replace(fNameRegex, '$1' + recursionName + '$2')
            .replace(/return/g, `return ${cacheName}[${keyName}] =`)
            .replace(
                /{/,
                `{\n  const ${keyName} = Array.from(arguments);\n\n  if (${cacheName}[${keyName}])\n    return ${cacheName}[${keyName}];\n`
            );

        const code = `function(){\nconst ${cacheName} = {};\n\nfunction ${
            recursionName + fCode
        }\n\nreturn ${recursionName}.apply(${recursionName}, arguments);}`;
console.log(code)
        let g = Function('"use strict";return ' + code)();

        if (boundObject) {
            let h = g.bind(boundObject);
            h.toString = () => code;
            return h;
        } else {
            return g;
        }
    } // End memo function

    function fib(n) {
        if (n <= 1) return 1;
        return fib(n - 1) + fib(n - 2);
    }


  

   

    // try{
    // let g = memo(fib);
    //     console.log(`g(100): ${g(100)}`);
    // }catch (e){ console.log(e)}
    
    try{
        let x = { g: fib };
        let h = memo(x.g);
        console.log(`h(100): ${h(100)}`);
    }catch (e){ console.log(e)}
    
    // try{
    //     let i = memo(function (x) {
    //         return fib(x);
    //     });
    //     console.log(`i(100): ${i(100)}`);
    // }catch (e){ console.log(e)}
    // try{
    //     let k = memo((x) => {
    //         return fib(x);
    //     });
    //     console.log(`k(100): ${k(100)}`);
    // }catch (e){ console.log(e)}
    
    // try{
    // let j = memo(new Proxy(fib, { get: (target, name) => fib }));

    //     console.log(`j(100): ${j(100)}`);
    // }catch (e){ console.log(e)}
}
a()