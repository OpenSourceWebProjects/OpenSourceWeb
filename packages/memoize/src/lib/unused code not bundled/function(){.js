function(){
const _A4pzf44M = {};

function _NlL5Htau(n) {
  const _R027c00C = Array.from(arguments);

  if (_A4pzf44M[_R027c00C])
    return _A4pzf44M[_R027c00C];

        if (n <= 1) return _A4pzf44M[_R027c00C] = 1;
        return _A4pzf44M[_R027c00C] = _NlL5Htau(n - 1) + _NlL5Htau(n - 2);
    }