function deepAssign(dst, source) {
  const keys = Object.keys(source);
  keys.forEach(key => {
    if(typeof dst[key] === 'object' && typeof source[key] === 'object') {
      deepAssign(dst[key], source[key]);
      return;
    }
    if(typeof source[key] === 'object') {
      dst[key] = source[key].map ? [] : {};
      deepAssign(dst[key], source[key]);
      return;
    }
    dst[key] = source[key];
  });
  return dst;
}

function h(type, attrs={}, ...childs) {
  var elm = document.createElement(type);
  deepAssign(elm, attrs);
  childs.forEach(function (child) {
    elm.appendChild(child);
  });
  return elm;
}

const dom = ['H1', 'H2', 'H3', 'P', 'LABEL', 'IMG', 'INPUT', 'DIV', 'SPAN', 'HR']
  .reduce((acc,type) => {
    acc[type.toLowerCase()] = (...args) => h(type, ...args);
    return acc;
  }, {});
