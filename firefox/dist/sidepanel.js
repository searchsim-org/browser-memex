(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var n, l$1, u$2, i$1, r$1, o$1, e$1, f$2, c$1, s$1, a$1, h$1, p$1, v$1, d$1 = {}, w$1 = [], _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, g = Array.isArray;
function m$1(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function b(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function k$1(l2, u2, t2) {
  var i2, r2, o2, e2 = {};
  for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
  return x(l2, e2, i2, r2, null);
}
function x(n2, t2, i2, r2, o2) {
  var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2, __i: -1, __u: 0 };
  return null == o2 && null != l$1.vnode && l$1.vnode(e2), e2;
}
function S(n2) {
  return n2.children;
}
function C$1(n2, l2) {
  this.props = n2, this.context = l2;
}
function $(n2, l2) {
  if (null == l2) return n2.__ ? $(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? $(n2) : null;
}
function I(n2) {
  if (n2.__P && n2.__d) {
    var u2 = n2.__v, t2 = u2.__e, i2 = [], r2 = [], o2 = m$1({}, u2);
    o2.__v = u2.__v + 1, l$1.vnode && l$1.vnode(o2), q$1(n2.__P, o2, u2, n2.__n, n2.__P.namespaceURI, 32 & u2.__u ? [t2] : null, i2, null == t2 ? $(u2) : t2, !!(32 & u2.__u), r2), o2.__v = u2.__v, o2.__.__k[o2.__i] = o2, D$1(i2, o2, r2), u2.__e = u2.__ = null, o2.__e != t2 && P(o2);
  }
}
function P(n2) {
  if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l2) {
    if (null != l2 && null != l2.__e) return n2.__e = n2.__c.base = l2.__e;
  }), P(n2);
}
function A$1(n2) {
  (!n2.__d && (n2.__d = true) && i$1.push(n2) && !H.__r++ || r$1 != l$1.debounceRendering) && ((r$1 = l$1.debounceRendering) || o$1)(H);
}
function H() {
  try {
    for (var n2, l2 = 1; i$1.length; ) i$1.length > l2 && i$1.sort(e$1), n2 = i$1.shift(), l2 = i$1.length, I(n2);
  } finally {
    i$1.length = H.__r = 0;
  }
}
function L(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, v2, y2, _2, g2, m2 = t2 && t2.__k || w$1, b2 = l2.length;
  for (f2 = T$1(u2, l2, m2, f2, b2), a2 = 0; a2 < b2; a2++) null != (p2 = u2.__k[a2]) && (h2 = -1 != p2.__i && m2[p2.__i] || d$1, p2.__i = a2, _2 = q$1(n2, p2, h2, i2, r2, o2, e2, f2, c2, s2), v2 = p2.__e, p2.ref && h2.ref != p2.ref && (h2.ref && J(h2.ref, null, p2), s2.push(p2.ref, p2.__c || v2, p2)), null == y2 && null != v2 && (y2 = v2), (g2 = !!(4 & p2.__u)) || h2.__k === p2.__k ? (f2 = j$1(p2, f2, n2, g2), g2 && h2.__e && (h2.__e = null)) : "function" == typeof p2.type && void 0 !== _2 ? f2 = _2 : v2 && (f2 = v2.nextSibling), p2.__u &= -7);
  return u2.__e = y2, f2;
}
function T$1(n2, l2, u2, t2, i2) {
  var r2, o2, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? ("string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? o2 = n2.__k[r2] = x(null, o2, null, null, null) : g(o2) ? o2 = n2.__k[r2] = x(S, { children: o2 }, null, null, null) : void 0 === o2.constructor && o2.__b > 0 ? o2 = n2.__k[r2] = x(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r2] = o2, f2 = r2 + h2, o2.__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = O(o2, u2, f2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
  if (a2) for (r2 = 0; r2 < s2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = $(e2)), K(e2, e2));
  return t2;
}
function j$1(n2, l2, u2, t2) {
  var i2, r2;
  if ("function" == typeof n2.type) {
    for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++) i2[r2] && (i2[r2].__ = n2, l2 = j$1(i2[r2], l2, u2, t2));
    return l2;
  }
  n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = $(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function O(n2, l2, u2, t2) {
  var i2, r2, o2, e2 = n2.key, f2 = n2.type, c2 = l2[u2], s2 = null != c2 && 0 == (2 & c2.__u);
  if (null === c2 && null == e2 || s2 && e2 == c2.key && f2 == c2.type) return u2;
  if (t2 > (s2 ? 1 : 0)) {
    for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[o2 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f2 == c2.type) return o2;
  }
  return -1;
}
function z$1(n2, l2, u2) {
  "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || _.test(l2) ? u2 : u2 + "px";
}
function N(n2, l2, u2, t2, i2) {
  var r2, o2;
  n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || z$1(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || z$1(n2.style, l2, u2[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(a$1, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2[s$1] = t2[s$1] : (u2[s$1] = h$1, n2.addEventListener(l2, r2 ? v$1 : p$1, r2)) : n2.removeEventListener(l2, r2 ? v$1 : p$1, r2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function V(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2[c$1]) u2[c$1] = h$1++;
      else if (u2[c$1] < t2[s$1]) return;
      return t2(l$1.event ? l$1.event(u2) : u2);
    }
  };
}
function q$1(n2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, v2, y2, d2, _2, k2, x2, M, $2, I2, P2, A2, H2, T2 = u2.type;
  if (void 0 !== u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (a2 = l$1.__b) && a2(u2);
  n: if ("function" == typeof T2) try {
    if (k2 = u2.props, x2 = T2.prototype && T2.prototype.render, M = (a2 = T2.contextType) && i2[a2.__c], $2 = a2 ? M ? M.props.value : a2.__ : i2, t2.__c ? _2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(k2, $2) : (u2.__c = h2 = new C$1(k2, $2), h2.constructor = T2, h2.render = Q), M && M.sub(h2), h2.state || (h2.state = {}), h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && null == h2.__s && (h2.__s = h2.state), x2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = m$1({}, h2.__s)), m$1(h2.__s, T2.getDerivedStateFromProps(k2, h2.__s))), v2 = h2.props, y2 = h2.state, h2.__v = u2, p2) x2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (x2 && null == T2.getDerivedStateFromProps && k2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(k2, $2), u2.__v == t2.__v || !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(k2, h2.__s, $2)) {
        u2.__v != t2.__v && (h2.props = k2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
          n3 && (n3.__ = u2);
        }), w$1.push.apply(h2.__h, h2._sb), h2._sb = [], h2.__h.length && e2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(k2, h2.__s, $2), x2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(v2, y2, d2);
      });
    }
    if (h2.context = $2, h2.props = k2, h2.__P = n2, h2.__e = false, I2 = l$1.__r, P2 = 0, x2) h2.state = h2.__s, h2.__d = false, I2 && I2(u2), a2 = h2.render(h2.props, h2.state, h2.context), w$1.push.apply(h2.__h, h2._sb), h2._sb = [];
    else do {
      h2.__d = false, I2 && I2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++P2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = m$1(m$1({}, i2), h2.getChildContext())), x2 && !p2 && null != h2.getSnapshotBeforeUpdate && (d2 = h2.getSnapshotBeforeUpdate(v2, y2)), A2 = null != a2 && a2.type === S && null == a2.key ? E(a2.props.children) : a2, f2 = L(n2, g(A2) ? A2 : [A2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), _2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u2.__v = null, c2 || null != o2) if (n3.then) {
      for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
      o2[o2.indexOf(f2)] = null, u2.__e = f2;
    } else {
      for (H2 = o2.length; H2--; ) b(o2[H2]);
      B$1(u2);
    }
    else u2.__e = t2.__e, u2.__k = t2.__k, n3.then || B$1(u2);
    l$1.__e(n3, u2, t2);
  }
  else null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = G(t2.__e, u2, t2, i2, r2, o2, e2, c2, s2);
  return (a2 = l$1.diffed) && a2(u2), 128 & u2.__u ? void 0 : f2;
}
function B$1(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B$1));
}
function D$1(n2, u2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) J(t2[i2], t2[++i2], t2[++i2]);
  l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$1.__e(n3, u3.__v);
    }
  });
}
function E(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : m$1({}, n2);
}
function G(u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, v2, y2, w2, _2, m2 = i2.props || d$1, k2 = t2.props, x2 = t2.type;
  if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
    for (a2 = 0; a2 < e2.length; a2++) if ((y2 = e2[a2]) && "setAttribute" in y2 == !!x2 && (x2 ? y2.localName == x2 : 3 == y2.nodeType)) {
      u2 = y2, e2[a2] = null;
      break;
    }
  }
  if (null == u2) {
    if (null == x2) return document.createTextNode(k2);
    u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$1.__m && l$1.__m(t2, e2), c2 = false), e2 = null;
  }
  if (null == x2) m2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
  else {
    if (e2 = e2 && n.call(u2.childNodes), !c2 && null != e2) for (m2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) m2[(y2 = u2.attributes[a2]).name] = y2.value;
    for (a2 in m2) y2 = m2[a2], "dangerouslySetInnerHTML" == a2 ? p2 = y2 : "children" == a2 || a2 in k2 || "value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2 || N(u2, a2, null, y2, o2);
    for (a2 in k2) y2 = k2[a2], "children" == a2 ? v2 = y2 : "dangerouslySetInnerHTML" == a2 ? h2 = y2 : "value" == a2 ? w2 = y2 : "checked" == a2 ? _2 = y2 : c2 && "function" != typeof y2 || m2[a2] === y2 || N(u2, a2, y2, m2[a2], o2);
    if (h2) c2 || p2 && (h2.__html == p2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
    else if (p2 && (u2.innerHTML = ""), L("template" == t2.type ? u2.content : u2, g(v2) ? v2 : [v2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && $(i2, 0), c2, s2), null != e2) for (a2 = e2.length; a2--; ) b(e2[a2]);
    c2 || (a2 = "value", "progress" == x2 && null == w2 ? u2.removeAttribute("value") : null != w2 && (w2 !== u2[a2] || "progress" == x2 && !w2 || "option" == x2 && w2 != m2[a2]) && N(u2, a2, w2, m2[a2], o2), a2 = "checked", null != _2 && _2 != u2[a2] && N(u2, a2, _2, m2[a2], o2));
  }
  return u2;
}
function J(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$1.__e(n3, t2);
  }
}
function K(n2, u2, t2) {
  var i2, r2;
  if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || J(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$1.__e(n3, u2);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && K(i2[r2], u2, t2 || "function" != typeof n2.type);
  t2 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function Q(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function R(u2, t2, i2) {
  var r2, o2, e2, f2;
  t2 == document && (t2 = document.documentElement), l$1.__ && l$1.__(u2, t2), o2 = (r2 = false) ? null : t2.__k, e2 = [], f2 = [], q$1(t2, u2 = t2.__k = k$1(S, null, [u2]), o2 || d$1, d$1, t2.namespaceURI, o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, o2 ? o2.__e : t2.firstChild, r2, f2), D$1(e2, u2, f2);
}
n = w$1.slice, l$1 = { __e: function(n2, l2, u2, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$2 = 0, C$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m$1({}, this.state), "function" == typeof n2 && (n2 = n2(m$1({}, u2), this.props)), n2 && m$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), A$1(this));
}, C$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), A$1(this));
}, C$1.prototype.render = S, i$1 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, H.__r = 0, f$2 = Math.random().toString(8), c$1 = "__d" + f$2, s$1 = "__a" + f$2, a$1 = /(PointerCapture)$|Capture$/i, h$1 = 0, p$1 = V(false), v$1 = V(true);
var f$1 = 0;
function u$1(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$1.vnode && l$1.vnode(l2), l2;
}
var t$1, r, u, i, o = 0, f = [], c = l$1, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
function p(n2, t2) {
  c.__h && c.__h(r, n2, o || t2), o = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function d(n2) {
  return o = 1, h(D, n2);
}
function h(n2, u2, i2) {
  var o2 = p(t$1++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [D(void 0, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r, !r.__f)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H) return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !c2 || c2.call(this, n3, t2, r2);
      var i3 = o2.__c.props !== n3;
      return u3.some(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
        }
      }), c2 && c2.call(this, n3, t2, r2) || i3;
    };
    r.__f = true;
    var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
    r.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = void 0, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y(n2, u2) {
  var i2 = p(t$1++, 3);
  !c.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
}
function A(n2) {
  return o = 5, T(function() {
    return { current: n2 };
  }, []);
}
function T(n2, r2) {
  var u2 = p(t$1++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function q(n2, t2) {
  return o = 8, T(function() {
    return n2;
  }, t2);
}
function j() {
  for (var n2; n2 = f.shift(); ) {
    var t2 = n2.__H;
    if (n2.__P && t2) try {
      t2.__h.some(z), t2.__h.some(B), t2.__h = [];
    } catch (r2) {
      t2.__h = [], c.__e(r2, n2.__v);
    }
  }
}
c.__b = function(n2) {
  r = null, e && e(n2);
}, c.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s && s(n2, t2);
}, c.__r = function(n2) {
  a && a(n2), t$1 = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.some(z), i2.__h.some(B), i2.__h = [], t$1 = 0)), u = r;
}, c.diffed = function(n2) {
  v && v(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j)), t2.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u = r = null;
}, c.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.some(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c.__e(r2, n3.__v);
    }
  }), l && l(n2, t2);
}, c.unmount = function(n2) {
  m && m(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.some(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
const PROVIDERS = {
  anthropic: {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1/messages",
    models: [
      { id: "claude-opus-4-5-20251101", name: "Opus 4.5" },
      { id: "claude-opus-4-20250514", name: "Opus 4" },
      { id: "claude-sonnet-4-20250514", name: "Sonnet 4" },
      { id: "claude-haiku-4-5-20251001", name: "Haiku 4.5" }
    ]
  },
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 Mini" },
      { id: "gpt-4.1", name: "GPT-4.1" },
      { id: "o3", name: "o3" },
      { id: "o4-mini", name: "o4-mini" }
    ]
  },
  google: {
    name: "Google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    models: [
      { id: "gemini-3-pro-preview", name: "Gemini 3 Pro (Preview)" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" }
    ]
  },
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      { id: "qwen/qwen3-vl-235b-a22b-thinking", name: "Qwen3 VL 235B (Reasoning)" },
      { id: "moonshotai/kimi-k2.5", name: "Kimi K2.5 (Reasoning)" },
      { id: "mistralai/mistral-large-2512", name: "Mistral Large 3" }
    ]
  }
};
const CODEX_MODELS = [
  { id: "gpt-5.1-codex-max", name: "GPT-5.1 Codex Max" },
  { id: "gpt-5.2-codex", name: "GPT-5.2 Codex" },
  { id: "gpt-5.1-codex-mini", name: "GPT-5.1 Codex Mini" },
  { id: "gpt-5.1-codex", name: "GPT-5.1 Codex" },
  { id: "gpt-5-codex", name: "GPT-5 Codex" }
];
const CONFIG_CHANGED_EVENT = "browser-memex.config-changed";
function notifyConfigChanged() {
  try {
    window.dispatchEvent(new CustomEvent(CONFIG_CHANGED_EVENT));
  } catch {
  }
}
function useConfig() {
  const [providerKeys, setProviderKeys] = d({});
  const [customModels, setCustomModels] = d([]);
  const [currentModelIndex, setCurrentModelIndex] = d(0);
  const [userSkills, setUserSkills] = d([]);
  const [builtInSkills, setBuiltInSkills] = d([]);
  const [availableModels, setAvailableModels] = d([]);
  const [oauthStatus, setOauthStatus] = d({ isOAuthEnabled: false, isAuthenticated: false });
  const [codexStatus, setCodexStatus] = d({ isAuthenticated: false });
  const [isLoading, setIsLoading] = d(true);
  y(() => {
    loadConfig();
    const onChanged = () => {
      loadConfig();
    };
    window.addEventListener(CONFIG_CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(CONFIG_CHANGED_EVENT, onChanged);
  }, []);
  const loadConfig = q(async () => {
    try {
      const config = await chrome.runtime.sendMessage({ type: "GET_CONFIG" });
      setProviderKeys(config.providerKeys || {});
      setCustomModels(config.customModels || []);
      setCurrentModelIndex(config.currentModelIndex || 0);
      setUserSkills(config.userSkills || []);
      setBuiltInSkills(config.builtInSkills || []);
      const oauth = await chrome.runtime.sendMessage({ type: "GET_OAUTH_STATUS" });
      setOauthStatus(oauth || { isOAuthEnabled: false, isAuthenticated: false });
      const codex = await chrome.runtime.sendMessage({ type: "GET_CODEX_STATUS" });
      setCodexStatus(codex || { isAuthenticated: false });
      await buildAvailableModels(
        config.providerKeys || {},
        config.customModels || [],
        oauth,
        codex,
        config.currentModelIndex || 0
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load config:", error);
      setIsLoading(false);
    }
  }, []);
  const buildAvailableModels = q(async (keys, custom, oauth, codex, activeIndex = 0) => {
    const models = [];
    const hasOAuth = (oauth == null ? void 0 : oauth.isOAuthEnabled) && (oauth == null ? void 0 : oauth.isAuthenticated);
    const hasCodexOAuth = codex == null ? void 0 : codex.isAuthenticated;
    if (hasCodexOAuth) {
      for (const model of CODEX_MODELS) {
        models.push({
          name: `${model.name} (Codex Plan)`,
          provider: "codex",
          modelId: model.id,
          baseUrl: "https://chatgpt.com/backend-api/codex/responses",
          apiKey: null,
          authMethod: "codex_oauth"
        });
      }
    }
    for (const [providerId, provider] of Object.entries(PROVIDERS)) {
      const hasApiKey = keys[providerId];
      if (providerId === "anthropic") {
        if (hasOAuth) {
          for (const model of provider.models) {
            models.push({
              name: `${model.name} (Claude Code)`,
              provider: providerId,
              modelId: model.id,
              baseUrl: provider.baseUrl,
              apiKey: null,
              authMethod: "oauth"
            });
          }
        }
        if (hasApiKey) {
          for (const model of provider.models) {
            models.push({
              name: `${model.name} (API)`,
              provider: providerId,
              modelId: model.id,
              baseUrl: provider.baseUrl,
              apiKey: hasApiKey,
              authMethod: "api_key"
            });
          }
        }
      } else if (hasApiKey) {
        for (const model of provider.models) {
          models.push({
            name: `${model.name} (API)`,
            provider: providerId,
            modelId: model.id,
            baseUrl: provider.baseUrl,
            apiKey: hasApiKey,
            authMethod: "api_key"
          });
        }
      }
    }
    for (const customModel of custom) {
      models.push({
        name: customModel.name,
        provider: "custom",
        modelId: customModel.modelId,
        baseUrl: customModel.baseUrl,
        apiKey: customModel.apiKey,
        authMethod: "api_key"
      });
    }
    setAvailableModels(models);
    const activeModel = models[activeIndex] || models[0];
    if (activeModel) {
      const providerHint = activeModel.provider === "custom" ? "openai" : activeModel.provider;
      await chrome.runtime.sendMessage({
        type: "SAVE_CONFIG",
        payload: {
          currentModelIndex: activeIndex,
          model: activeModel.modelId,
          apiBaseUrl: activeModel.baseUrl,
          apiKey: activeModel.apiKey,
          authMethod: activeModel.authMethod,
          provider: providerHint
        }
      }).catch(() => {
      });
    }
    return models;
  }, []);
  const saveConfig = q(async () => {
    await chrome.runtime.sendMessage({
      type: "SAVE_CONFIG",
      payload: {
        providerKeys,
        customModels,
        currentModelIndex,
        userSkills
      }
    });
    notifyConfigChanged();
  }, [providerKeys, customModels, currentModelIndex, userSkills]);
  const selectModel = q(async (index) => {
    setCurrentModelIndex(index);
    const model = availableModels[index];
    if (model) {
      await chrome.runtime.sendMessage({ type: "CLEAR_CHAT" }).catch(() => {
      });
      const providerHint = model.provider === "custom" ? "openai" : model.provider;
      await chrome.runtime.sendMessage({
        type: "SAVE_CONFIG",
        payload: {
          currentModelIndex: index,
          model: model.modelId,
          apiBaseUrl: model.baseUrl,
          apiKey: model.apiKey,
          authMethod: model.authMethod,
          provider: providerHint
        }
      });
      notifyConfigChanged();
    }
  }, [availableModels]);
  const setProviderKey = q((provider, key) => {
    setProviderKeys((prev) => ({ ...prev, [provider]: key }));
  }, []);
  const addCustomModel = q((model) => {
    setCustomModels((prev) => [...prev, model]);
  }, []);
  const removeCustomModel = q((index) => {
    setCustomModels((prev) => prev.filter((_2, i2) => i2 !== index));
  }, []);
  const addUserSkill = q((skill) => {
    setUserSkills((prev) => {
      const existingIndex = prev.findIndex((s2) => s2.domain === skill.domain);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = skill;
        return updated;
      }
      return [...prev, skill];
    });
  }, []);
  const removeUserSkill = q((index) => {
    setUserSkills((prev) => prev.filter((_2, i2) => i2 !== index));
  }, []);
  const importCLI = q(async () => {
    const result = await chrome.runtime.sendMessage({ type: "IMPORT_CLI_CREDENTIALS" });
    if (result.success) {
      await loadConfig();
    }
    return result;
  }, [loadConfig]);
  const logoutCLI = q(async () => {
    await chrome.runtime.sendMessage({ type: "OAUTH_LOGOUT" });
    await loadConfig();
  }, [loadConfig]);
  const importCodex = q(async () => {
    const result = await chrome.runtime.sendMessage({ type: "IMPORT_CODEX_CREDENTIALS" });
    if (result.success) {
      await loadConfig();
    }
    return result;
  }, [loadConfig]);
  const logoutCodex = q(async () => {
    await chrome.runtime.sendMessage({ type: "CODEX_LOGOUT" });
    await loadConfig();
  }, [loadConfig]);
  const currentModel = availableModels[currentModelIndex] || null;
  return {
    // State
    providerKeys,
    customModels,
    currentModelIndex,
    userSkills,
    builtInSkills,
    availableModels,
    currentModel,
    oauthStatus,
    codexStatus,
    isLoading,
    // Actions
    loadConfig,
    saveConfig,
    selectModel,
    setProviderKey,
    addCustomModel,
    removeCustomModel,
    addUserSkill,
    removeUserSkill,
    importCLI,
    logoutCLI,
    importCodex,
    logoutCodex
  };
}
function useChat() {
  const [messages, setMessages] = d([]);
  const [isRunning, setIsRunning] = d(false);
  const [attachedImages, setAttachedImages] = d([]);
  const [sessionTabGroupId, setSessionTabGroupId] = d(null);
  const [pendingPlan, setPendingPlan] = d(null);
  const [lastTrajectory, setLastTrajectory] = d(null);
  const [pendingStep, setPendingStep] = d(null);
  const [currentSteps, setCurrentSteps] = d([]);
  const currentStepsRef = A([]);
  const streamingTextRef = A("");
  const [streamingMessageId, setStreamingMessageId] = d(null);
  y(() => {
    const listener = (message) => {
      switch (message.type) {
        case "TASK_UPDATE":
          handleTaskUpdate(message.update);
          break;
        case "TASK_COMPLETE":
          handleTaskComplete(message.result, message.trajectory);
          break;
        case "TASK_ERROR":
          handleTaskError(message.error);
          break;
        case "PLAN_APPROVAL_REQUIRED":
          setPendingPlan(message.plan);
          break;
        case "SESSION_GROUP_UPDATE":
          setSessionTabGroupId(message.tabGroupId);
          break;
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);
  const handleTaskUpdate = q((update) => {
    if (update.status === "thinking") {
      setMessages((prev) => {
        const filtered = prev.filter((m2) => m2.type !== "thinking");
        return [...filtered, { id: Date.now(), type: "thinking" }];
      });
      setStreamingMessageId(null);
      streamingTextRef.current = "";
    } else if (update.status === "streaming" && update.text) {
      streamingTextRef.current = update.text;
      setMessages((prev) => {
        const filtered = prev.filter((m2) => m2.type !== "thinking");
        const existingStreamingIndex = filtered.findIndex((m2) => m2.type === "streaming");
        if (existingStreamingIndex >= 0) {
          const updated = [...filtered];
          updated[existingStreamingIndex] = {
            ...updated[existingStreamingIndex],
            text: update.text
          };
          return updated;
        } else {
          const msgId = Date.now();
          setStreamingMessageId(msgId);
          return [...filtered, {
            id: msgId,
            type: "streaming",
            text: update.text
          }];
        }
      });
    } else if (update.status === "executing") {
      setMessages((prev) => prev.filter((m2) => m2.type !== "thinking"));
      setPendingStep({ tool: update.tool, input: update.input });
    } else if (update.status === "executed") {
      const newSteps = [...currentStepsRef.current, {
        tool: update.tool,
        input: (pendingStep == null ? void 0 : pendingStep.input) || update.input,
        result: update.result
      }];
      currentStepsRef.current = newSteps;
      setCurrentSteps(newSteps);
      setPendingStep(null);
    } else if (update.status === "message" && update.text) {
      const stepsForMessage = [...currentStepsRef.current];
      currentStepsRef.current = [];
      setCurrentSteps([]);
      setMessages((prev) => {
        const filtered = prev.filter((m2) => m2.type !== "thinking" && m2.type !== "streaming");
        return [...filtered, {
          id: Date.now(),
          type: "assistant",
          text: update.text,
          steps: stepsForMessage
          // Attach steps to this message
        }];
      });
      setStreamingMessageId(null);
      streamingTextRef.current = "";
    }
  }, [pendingStep]);
  const handleTaskComplete = q((result, trajectory) => {
    var _a;
    setIsRunning(false);
    setStreamingMessageId(null);
    streamingTextRef.current = "";
    if ((result == null ? void 0 : result.success) && trajectory && ((_a = trajectory.steps) == null ? void 0 : _a.length) > 0) {
      setLastTrajectory(trajectory);
    } else {
      setLastTrajectory(null);
    }
    const orphanedSteps = [...currentStepsRef.current];
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);
    setMessages((prev) => {
      let filtered = prev.filter((m2) => m2.type !== "thinking" && m2.type !== "streaming");
      if (orphanedSteps.length > 0) {
        filtered = [...filtered, {
          id: Date.now(),
          type: "assistant",
          text: "",
          steps: orphanedSteps
        }];
      }
      if (result.message && !result.success) {
        filtered = [...filtered, {
          id: Date.now() + 1,
          type: "system",
          text: result.message
        }];
      }
      return filtered;
    });
  }, []);
  const handleTaskError = q((error) => {
    setIsRunning(false);
    setStreamingMessageId(null);
    streamingTextRef.current = "";
    const orphanedSteps = [...currentStepsRef.current];
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);
    setMessages((prev) => {
      let filtered = prev.filter((m2) => m2.type !== "thinking" && m2.type !== "streaming");
      if (orphanedSteps.length > 0) {
        filtered = [...filtered, {
          id: Date.now(),
          type: "assistant",
          text: "",
          steps: orphanedSteps
        }];
      }
      return [...filtered, {
        id: Date.now() + 1,
        type: "error",
        text: `Error: ${error}`
      }];
    });
  }, []);
  const sendMessage = q(async (text, { background = false } = {}) => {
    if (!text.trim() || isRunning) return;
    const userMessage = {
      id: Date.now(),
      type: "user",
      text,
      images: [...attachedImages],
      background
    };
    setMessages((prev) => [...prev, userMessage]);
    const imagesToSend = [...attachedImages];
    setAttachedImages([]);
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: "error",
        text: "No active tab found"
      }]);
      return;
    }
    setIsRunning(true);
    try {
      await chrome.runtime.sendMessage({
        type: "START_TASK",
        payload: {
          tabId: tab.id,
          task: text,
          askBeforeActing: false,
          images: imagesToSend,
          tabGroupId: sessionTabGroupId,
          background
        }
      });
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: "error",
        text: `Error: ${error.message}`
      }]);
      setIsRunning(false);
    }
  }, [isRunning, attachedImages, sessionTabGroupId]);
  const stopTask = q(() => {
    chrome.runtime.sendMessage({ type: "STOP_TASK" }).catch(() => {
    });
    setIsRunning(false);
  }, []);
  const clearChat = q(() => {
    setMessages([]);
    currentStepsRef.current = [];
    setPendingStep(null);
    setStreamingMessageId(null);
    streamingTextRef.current = "";
    setSessionTabGroupId(null);
    chrome.runtime.sendMessage({ type: "CLEAR_CONVERSATION" }).catch(() => {
    });
  }, []);
  const approvePlan = q(() => {
    chrome.runtime.sendMessage({ type: "PLAN_APPROVAL_RESPONSE", payload: { approved: true } });
    setPendingPlan(null);
  }, []);
  const cancelPlan = q(() => {
    chrome.runtime.sendMessage({ type: "PLAN_APPROVAL_RESPONSE", payload: { approved: false } });
    setPendingPlan(null);
  }, []);
  const addImage = q((dataUrl) => {
    setAttachedImages((prev) => [...prev, dataUrl]);
  }, []);
  const removeImage = q((index) => {
    setAttachedImages((prev) => prev.filter((_2, i2) => i2 !== index));
  }, []);
  const clearImages = q(() => {
    setAttachedImages([]);
  }, []);
  const restoreMessages = q((savedMessages) => {
    setMessages(savedMessages || []);
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);
    setStreamingMessageId(null);
    streamingTextRef.current = "";
    setIsRunning(false);
    chrome.runtime.sendMessage({ type: "CLEAR_CONVERSATION" }).catch(() => {
    });
  }, []);
  const dismissLastTrajectory = q(() => setLastTrajectory(null), []);
  return {
    // State
    messages,
    isRunning,
    attachedImages,
    pendingStep,
    pendingPlan,
    currentSteps,
    lastTrajectory,
    // Actions
    sendMessage,
    stopTask,
    clearChat,
    approvePlan,
    cancelPlan,
    addImage,
    removeImage,
    clearImages,
    restoreMessages,
    dismissLastTrajectory
  };
}
const STORAGE_KEY$1 = "chatSessions";
const MAX_SESSIONS = 30;
function useChatHistory() {
  const [sessions, setSessions] = d([]);
  const [activeSessionId, setActiveSessionId] = d(null);
  y(() => {
    chrome.storage.local.get(STORAGE_KEY$1).then(({ chatSessions }) => {
      const list = chatSessions || [];
      setSessions(list);
    });
  }, []);
  const persist = (list) => {
    chrome.storage.local.set({ [STORAGE_KEY$1]: list });
  };
  const saveSession = q((messages) => {
    if (!messages || messages.length === 0) return;
    setSessions((prev) => {
      const firstUserMsg = messages.find((m2) => m2.type === "user");
      const title = firstUserMsg ? firstUserMsg.text.substring(0, 60) + (firstUserMsg.text.length > 60 ? "..." : "") : "New Chat";
      const now = Date.now();
      let updated;
      if (activeSessionId) {
        updated = prev.map(
          (s2) => s2.id === activeSessionId ? { ...s2, title, messages, updatedAt: now } : s2
        );
      } else {
        const newSession2 = { id: now, title, messages, createdAt: now, updatedAt: now };
        setActiveSessionId(now);
        updated = [newSession2, ...prev].slice(0, MAX_SESSIONS);
      }
      persist(updated);
      return updated;
    });
  }, [activeSessionId]);
  const newSession = q((currentMessages) => {
    if (currentMessages && currentMessages.length > 0) {
      const firstUserMsg = currentMessages.find((m2) => m2.type === "user");
      const title = firstUserMsg ? firstUserMsg.text.substring(0, 60) + (firstUserMsg.text.length > 60 ? "..." : "") : "New Chat";
      const now = Date.now();
      setSessions((prev) => {
        let updated;
        if (activeSessionId) {
          updated = prev.map(
            (s2) => s2.id === activeSessionId ? { ...s2, title, messages: currentMessages, updatedAt: now } : s2
          );
        } else {
          updated = [{ id: now, title, messages: currentMessages, createdAt: now, updatedAt: now }, ...prev].slice(0, MAX_SESSIONS);
        }
        persist(updated);
        return updated;
      });
    }
    setActiveSessionId(null);
  }, [activeSessionId]);
  const restoreSession = q((sessionId) => {
    const session = sessions.find((s2) => s2.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      return session.messages;
    }
    return null;
  }, [sessions]);
  const deleteSession = q((sessionId) => {
    setSessions((prev) => {
      const updated = prev.filter((s2) => s2.id !== sessionId);
      persist(updated);
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
      return updated;
    });
  }, [activeSessionId]);
  return {
    sessions,
    activeSessionId,
    saveSession,
    newSession,
    restoreSession,
    deleteSession
  };
}
function Header({
  currentModel,
  availableModels,
  currentModelIndex,
  onModelSelect,
  onNewChat,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession
}) {
  const [isDropdownOpen, setIsDropdownOpen] = d(false);
  const [isHistoryOpen, setIsHistoryOpen] = d(false);
  const dropdownRef = A(null);
  const historyRef = A(null);
  y(() => {
    const handleClickOutside = (e2) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e2.target)) {
        setIsDropdownOpen(false);
      }
      if (historyRef.current && !historyRef.current.contains(e2.target) && !e2.target.closest(".history-toggle-btn")) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleModelSelect = (index) => {
    onModelSelect(index);
    setIsDropdownOpen(false);
  };
  const handleSelectSession = (id) => {
    onSelectSession(id);
    setIsHistoryOpen(false);
  };
  const formatTime = (ts) => {
    if (!ts) return "";
    const d2 = new Date(ts);
    const now = /* @__PURE__ */ new Date();
    const diff = now - d2;
    if (diff < 864e5 && d2.getDate() === now.getDate()) return "Today";
    if (diff < 1728e5) return "Yesterday";
    return d2.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const grouped = {};
  (sessions || []).forEach((s2) => {
    const label = formatTime(s2.updatedAt || s2.createdAt);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s2);
  });
  return /* @__PURE__ */ u$1("div", { class: "header-wrapper", children: [
    /* @__PURE__ */ u$1("div", { class: "header", children: [
      /* @__PURE__ */ u$1("div", { class: "header-left", children: /* @__PURE__ */ u$1("div", { class: "model-selector", ref: dropdownRef, children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            class: "model-selector-btn",
            onClick: () => setIsDropdownOpen(!isDropdownOpen),
            children: [
              /* @__PURE__ */ u$1("span", { class: "model-dot" }),
              /* @__PURE__ */ u$1("span", { class: "current-model-name", children: (currentModel == null ? void 0 : currentModel.name) || "Select Model" }),
              /* @__PURE__ */ u$1("svg", { class: "chevron", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", children: /* @__PURE__ */ u$1("path", { d: "M6 9l6 6 6-6" }) })
            ]
          }
        ),
        isDropdownOpen && /* @__PURE__ */ u$1("div", { class: "model-dropdown", children: /* @__PURE__ */ u$1("div", { class: "model-list", children: availableModels.length === 0 ? /* @__PURE__ */ u$1("div", { class: "model-item disabled", children: "No models configured" }) : availableModels.map((model, index) => /* @__PURE__ */ u$1(
          "button",
          {
            class: `model-item ${index === currentModelIndex ? "active" : ""}`,
            onClick: () => handleModelSelect(index),
            children: [
              /* @__PURE__ */ u$1("span", { class: "model-item-dot" }),
              model.name,
              index === currentModelIndex && /* @__PURE__ */ u$1("svg", { class: "model-check", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", children: /* @__PURE__ */ u$1("polyline", { points: "20 6 9 17 4 12" }) })
            ]
          },
          index
        )) }) })
      ] }) }),
      /* @__PURE__ */ u$1("div", { class: "header-right", children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            class: `icon-btn history-toggle-btn ${isHistoryOpen ? "active" : ""}`,
            onClick: () => setIsHistoryOpen(!isHistoryOpen),
            title: "Chat history",
            children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", children: [
              /* @__PURE__ */ u$1("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ u$1("polyline", { points: "12 6 12 12 16 14" })
            ] })
          }
        ),
        /* @__PURE__ */ u$1("button", { class: "icon-btn", onClick: onNewChat, title: "New chat", children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", children: /* @__PURE__ */ u$1("path", { d: "M12 5v14M5 12h14" }) }) })
      ] })
    ] }),
    isHistoryOpen && /* @__PURE__ */ u$1("div", { class: "history-panel", ref: historyRef, children: Object.keys(grouped).length === 0 ? /* @__PURE__ */ u$1("div", { class: "history-empty", children: "No previous chats" }) : Object.entries(grouped).map(([label, items]) => /* @__PURE__ */ u$1("div", { class: "history-group", children: [
      /* @__PURE__ */ u$1("div", { class: "history-date", children: label }),
      items.map((s2) => /* @__PURE__ */ u$1(
        "div",
        {
          class: `history-item ${s2.id === activeSessionId ? "active" : ""}`,
          onClick: () => handleSelectSession(s2.id),
          children: [
            /* @__PURE__ */ u$1("span", { class: "history-title", children: s2.title }),
            /* @__PURE__ */ u$1(
              "button",
              {
                class: "history-delete",
                onClick: (e2) => {
                  e2.stopPropagation();
                  onDeleteSession(s2.id);
                },
                title: "Delete",
                children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", width: "12", height: "12", children: /* @__PURE__ */ u$1("path", { d: "M18 6L6 18M6 6l12 12" }) })
              }
            )
          ]
        },
        s2.id
      ))
    ] }, label)) })
  ] });
}
function formatMarkdown(text) {
  if (!text) return "";
  const lines = text.split("\n");
  let result = [];
  let inList = false;
  let listType = null;
  for (const line of lines) {
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
        result.push("<ul>");
        inList = true;
        listType = "ul";
      }
      result.push(`<li>${formatInline(ulMatch[1])}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
        result.push("<ol>");
        inList = true;
        listType = "ol";
      }
      result.push(`<li>${formatInline(olMatch[2])}</li>`);
    } else {
      if (inList) {
        result.push(listType === "ol" ? "</ol>" : "</ul>");
        inList = false;
        listType = null;
      }
      if (line.trim() === "") {
        result.push("<br>");
      } else {
        result.push(`<p>${formatInline(line)}</p>`);
      }
    }
  }
  if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
  return result.join("");
}
function formatInline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code>$1</code>");
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function getActionDescription(toolName, input) {
  var _a;
  if (!input) return toolName;
  switch (toolName) {
    case "computer": {
      const action = input.action;
      if (action === "screenshot") return "Taking screenshot";
      if (action === "left_click") {
        if (input.ref) return `Clicking ${input.ref}`;
        if (input.coordinate) return `Clicking at (${input.coordinate[0]}, ${input.coordinate[1]})`;
        return "Clicking";
      }
      if (action === "right_click") return "Right-clicking";
      if (action === "double_click") return "Double-clicking";
      if (action === "type") return `Typing "${(input.text || "").substring(0, 30)}${((_a = input.text) == null ? void 0 : _a.length) > 30 ? "..." : ""}"`;
      if (action === "key") return `Pressing ${input.text}`;
      if (action === "scroll") return `Scrolling ${input.scroll_direction}`;
      if (action === "mouse_move") return "Moving mouse";
      if (action === "drag") return "Dragging";
      return `Computer: ${action}`;
    }
    case "navigate":
      if (input.action === "back") return "Going back";
      if (input.action === "forward") return "Going forward";
      return `Navigating to ${(input.url || "").substring(0, 50)}...`;
    case "read_page":
      return "Reading page structure";
    case "get_page_text":
      return "Extracting page text";
    case "find":
      return `Finding "${input.query}"`;
    case "form_input":
      return `Filling form field ${input.ref}`;
    case "file_upload":
      return "Uploading file";
    case "javascript_tool":
      return "Running JavaScript";
    case "tabs_context":
      return "Getting tab context";
    case "tabs_create":
      return "Creating new tab";
    case "tabs_close":
      return "Closing tab";
    case "read_console_messages":
      return "Reading console";
    case "read_network_requests":
      return "Reading network requests";
    default:
      return toolName;
  }
}
function formatStepResult(result) {
  if (!result) return "";
  if (typeof result === "string") {
    if (result.length > 100) {
      return result.substring(0, 100) + "...";
    }
    return result;
  }
  if (typeof result === "object") {
    if (result.error) return `Error: ${result.error}`;
    if (result.output) {
      const output = typeof result.output === "string" ? result.output : JSON.stringify(result.output);
      return output.length > 100 ? output.substring(0, 100) + "..." : output;
    }
  }
  return "";
}
function Message({ message }) {
  const { type, text, images } = message;
  if (type === "thinking") {
    return /* @__PURE__ */ u$1("div", { class: "message thinking", children: /* @__PURE__ */ u$1("div", { class: "thinking-indicator", children: [
      /* @__PURE__ */ u$1("div", { class: "sparkle-container", children: /* @__PURE__ */ u$1("svg", { class: "sparkle", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", children: [
        /* @__PURE__ */ u$1("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ u$1("path", { d: "M12 6v6l4 2" })
      ] }) }),
      /* @__PURE__ */ u$1("span", { children: "Thinking..." })
    ] }) });
  }
  if (type === "streaming") {
    return /* @__PURE__ */ u$1("div", { class: "message assistant streaming", children: [
      /* @__PURE__ */ u$1("div", { class: "bullet" }),
      /* @__PURE__ */ u$1(
        "div",
        {
          class: "content",
          dangerouslySetInnerHTML: { __html: formatMarkdown(text) }
        }
      )
    ] });
  }
  if (type === "user") {
    return /* @__PURE__ */ u$1("div", { class: "message user", children: [
      images && images.length > 0 && /* @__PURE__ */ u$1("div", { class: "message-images", children: images.map((img, i2) => /* @__PURE__ */ u$1("img", { src: img, alt: `Attached ${i2 + 1}` }, i2)) }),
      text && /* @__PURE__ */ u$1("span", { children: text })
    ] });
  }
  if (type === "assistant") {
    if (!text) return null;
    return /* @__PURE__ */ u$1("div", { class: "message assistant", children: [
      /* @__PURE__ */ u$1("div", { class: "bullet" }),
      /* @__PURE__ */ u$1(
        "div",
        {
          class: "content",
          dangerouslySetInnerHTML: { __html: formatMarkdown(text) }
        }
      )
    ] });
  }
  if (type === "error") {
    return /* @__PURE__ */ u$1("div", { class: "message error", children: text });
  }
  if (type === "system") {
    return /* @__PURE__ */ u$1("div", { class: "message system", children: text });
  }
  return null;
}
function StepsSection({ steps, pendingStep }) {
  const [isExpanded, setIsExpanded] = d(false);
  const prevCountRef = A(0);
  const listRef = A(null);
  const completedCount = steps.length;
  const totalSteps = completedCount + (pendingStep ? 1 : 0);
  const hasPending = !!pendingStep;
  y(() => {
    if (isExpanded && listRef.current && steps.length > prevCountRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    prevCountRef.current = steps.length;
  }, [steps.length, isExpanded]);
  if (totalSteps === 0) return null;
  return /* @__PURE__ */ u$1("div", { class: "steps-thread", children: [
    /* @__PURE__ */ u$1(
      "div",
      {
        class: `steps-thread-toggle ${isExpanded ? "expanded" : ""}`,
        onClick: () => setIsExpanded(!isExpanded),
        children: [
          /* @__PURE__ */ u$1("div", { class: "steps-thread-label", children: "Agent Steps" }),
          /* @__PURE__ */ u$1("div", { class: `steps-thread-badge ${hasPending ? "running" : "done"}`, children: hasPending ? /* @__PURE__ */ u$1(S, { children: [
            /* @__PURE__ */ u$1("span", { class: "steps-thread-pulse" }),
            completedCount,
            " of ",
            totalSteps
          ] }) : /* @__PURE__ */ u$1(S, { children: [
            completedCount,
            " done"
          ] }) }),
          /* @__PURE__ */ u$1("svg", { class: "steps-thread-chevron", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", width: "14", height: "14", children: /* @__PURE__ */ u$1("path", { d: "M6 9l6 6 6-6" }) })
        ]
      }
    ),
    /* @__PURE__ */ u$1("div", { ref: listRef, class: `steps-thread-list ${isExpanded ? "visible" : ""}`, children: [
      steps.map((step, index) => /* @__PURE__ */ u$1(StepRow, { step, status: "completed", index }, index)),
      pendingStep && /* @__PURE__ */ u$1(StepRow, { step: pendingStep, status: "pending", index: steps.length })
    ] })
  ] });
}
function StepRow({ step, status, index }) {
  const description = getActionDescription(step.tool, step.input);
  const resultText = status === "completed" ? formatStepResult(step.result) : null;
  return /* @__PURE__ */ u$1("div", { class: `steps-thread-row ${status}`, style: { animationDelay: `${Math.min(index * 30, 200)}ms` }, children: [
    /* @__PURE__ */ u$1("span", { class: "steps-thread-icon", children: status === "completed" ? /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", width: "11", height: "11", children: /* @__PURE__ */ u$1("polyline", { points: "20 6 9 17 4 12" }) }) : /* @__PURE__ */ u$1("span", { class: "steps-thread-spinner" }) }),
    /* @__PURE__ */ u$1("span", { class: "steps-thread-desc", children: escapeHtml(description) }),
    resultText && /* @__PURE__ */ u$1("span", { class: "steps-thread-result", children: escapeHtml(resultText) })
  ] });
}
function MessageList({ messages, pendingStep, currentSteps = [] }) {
  const containerRef = A(null);
  const isAtBottomRef = A(true);
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;
  };
  y(() => {
    if (isAtBottomRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);
  const renderContent = () => {
    const content = [];
    for (let i2 = 0; i2 < messages.length; i2++) {
      const msg = messages[i2];
      if (msg.type === "assistant" && msg.steps && msg.steps.length > 0) {
        content.push(
          /* @__PURE__ */ u$1(
            StepsSection,
            {
              steps: msg.steps,
              pendingStep: null
            },
            `steps-${msg.id}`
          )
        );
      }
      content.push(/* @__PURE__ */ u$1(Message, { message: msg }, msg.id));
    }
    if (currentSteps.length > 0 || pendingStep) {
      content.push(
        /* @__PURE__ */ u$1(
          StepsSection,
          {
            steps: currentSteps,
            pendingStep
          },
          "steps-pending"
        )
      );
    }
    return content;
  };
  return /* @__PURE__ */ u$1(
    "div",
    {
      class: "messages",
      ref: containerRef,
      onScroll: handleScroll,
      children: renderContent()
    }
  );
}
let _subscriber$1 = null;
let _idCounter = 0;
function emit$1(toast) {
  if (typeof _subscriber$1 === "function") _subscriber$1(toast);
}
function subscribeToasts(cb) {
  _subscriber$1 = cb;
  return () => {
    if (_subscriber$1 === cb) _subscriber$1 = null;
  };
}
function showToast(message, opts = {}) {
  _idCounter += 1;
  emit$1({
    id: _idCounter,
    message,
    kind: opts.kind ?? "info",
    durationMs: opts.durationMs ?? 2400
  });
}
const TEXT_LIKE_EXTS = [".txt", ".md", ".markdown", ".json", ".csv", ".tsv", ".yaml", ".yml", ".log", ".html", ".htm", ".xml"];
const MAX_TEXT_FILE_BYTES = 256 * 1024;
function isTextLike(file) {
  if (file.type.startsWith("text/")) return true;
  if (file.type === "application/json") return true;
  const name = (file.name || "").toLowerCase();
  return TEXT_LIKE_EXTS.some((ext) => name.endsWith(ext));
}
function InputArea({
  isRunning,
  attachedImages,
  onSend,
  onStop,
  onAddImage,
  onRemoveImage,
  hasModels,
  suggestedText,
  onClearSuggestion
}) {
  const [text, setText] = d("");
  const [background, setBackground] = d(false);
  const [attachError, setAttachError] = d(null);
  const fileInputRef = A(null);
  const toggleBackground = q(() => {
    setBackground((prev) => !prev);
  }, []);
  y(() => {
    if (suggestedText) {
      setText(suggestedText);
      onClearSuggestion();
    }
  }, [suggestedText, onClearSuggestion]);
  const [isDragging, setIsDragging] = d(false);
  const inputRef = A(null);
  const handleSubmit = () => {
    if (!text.trim() || isRunning) return;
    if (!hasModels) {
      showToast("Configure a model in the Agents tab first", { kind: "error" });
      return;
    }
    onSend(text, { background });
    setText("");
    setBackground(false);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };
  const handleKeyDown = (e2) => {
    if (e2.key === "Enter" && !e2.shiftKey) {
      e2.preventDefault();
      handleSubmit();
    }
  };
  const handleInput = (e2) => {
    setText(e2.target.value);
    e2.target.style.height = "auto";
    e2.target.style.height = Math.min(e2.target.scrollHeight, 150) + "px";
  };
  const handleDragOver = (e2) => {
    e2.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e2) => {
    e2.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e2) => {
    e2.preventDefault();
    setIsDragging(false);
    const files = e2.dataTransfer.files;
    handleFiles(files);
  };
  const handleFiles = (files) => {
    setAttachError(null);
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        readImageFile(file);
      } else if (isTextLike(file)) {
        readTextFile(file);
      } else {
        setAttachError(`Unsupported file type: ${file.name || file.type}`);
      }
    }
  };
  const readTextFile = (file) => {
    if (file.size > MAX_TEXT_FILE_BYTES) {
      setAttachError(`${file.name}: too large (max ${MAX_TEXT_FILE_BYTES / 1024} KB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e2) => {
      const content = String(e2.target.result ?? "");
      setText((prev) => {
        const header = `

--- file: ${file.name} (${file.size} bytes) ---
`;
        return (prev || "") + header + content;
      });
    };
    reader.readAsText(file);
  };
  const handlePickFiles = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  const handleFileChange = (e2) => {
    handleFiles(e2.target.files);
    e2.target.value = "";
  };
  const handlePaste = (e2) => {
    var _a;
    const items = (_a = e2.clipboardData) == null ? void 0 : _a.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e2.preventDefault();
          const file = item.getAsFile();
          if (file) readImageFile(file);
          break;
        }
      }
    }
  };
  const readImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e2) => {
      onAddImage(e2.target.result);
    };
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ u$1(
    "div",
    {
      class: `input-container ${isDragging ? "drag-over" : ""}`,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      children: [
        attachedImages.length > 0 && /* @__PURE__ */ u$1("div", { class: "image-preview", children: attachedImages.map((img, i2) => /* @__PURE__ */ u$1("div", { class: "image-preview-item", children: [
          /* @__PURE__ */ u$1("img", { src: img, alt: `Preview ${i2 + 1}` }),
          /* @__PURE__ */ u$1(
            "button",
            {
              class: "remove-image-btn",
              onClick: () => onRemoveImage(i2),
              children: "×"
            }
          )
        ] }, i2)) }),
        attachError && /* @__PURE__ */ u$1("div", { class: "input-attach-error", children: attachError }),
        /* @__PURE__ */ u$1(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            multiple: true,
            accept: "image/*,.txt,.md,.markdown,.json,.csv,.tsv,.yaml,.yml,.log,.html,.htm,.xml,text/*,application/json",
            onChange: handleFileChange,
            style: { display: "none" }
          }
        ),
        /* @__PURE__ */ u$1("div", { class: "input-row", children: [
          !isRunning && /* @__PURE__ */ u$1(
            "button",
            {
              class: "attach-btn",
              onClick: handlePickFiles,
              title: "Attach images or text files",
              type: "button",
              children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", children: /* @__PURE__ */ u$1("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" }) })
            }
          ),
          !isRunning && /* @__PURE__ */ u$1("div", { class: "bg-inline-wrap", "data-tip": background ? "Background" : "Foreground", children: /* @__PURE__ */ u$1(
            "button",
            {
              class: `bg-inline-btn ${background ? "active" : ""}`,
              onClick: toggleBackground,
              children: background ? /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", children: [
                /* @__PURE__ */ u$1("rect", { x: "1", y: "5", width: "15", height: "11", rx: "2" }),
                /* @__PURE__ */ u$1("rect", { x: "8", y: "2", width: "15", height: "11", rx: "2", opacity: "0.4" })
              ] }) : /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", children: [
                /* @__PURE__ */ u$1("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
                /* @__PURE__ */ u$1("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
                /* @__PURE__ */ u$1("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
              ] })
            }
          ) }),
          /* @__PURE__ */ u$1(
            "textarea",
            {
              ref: inputRef,
              class: "input",
              placeholder: "What would you like me to do?",
              value: text,
              onInput: handleInput,
              onKeyDown: handleKeyDown,
              onPaste: handlePaste,
              rows: 1
            }
          ),
          isRunning ? /* @__PURE__ */ u$1("button", { class: "stop-btn", onClick: onStop, title: "Stop task", children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ u$1("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }) }) }) : /* @__PURE__ */ u$1(
            "button",
            {
              class: "send-btn",
              onClick: handleSubmit,
              disabled: !text.trim(),
              title: background ? "Run in background" : "Send",
              children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", children: [
                /* @__PURE__ */ u$1("path", { d: "M12 19V5" }),
                /* @__PURE__ */ u$1("path", { d: "M5 12l7-7 7 7" })
              ] })
            }
          )
        ] })
      ]
    }
  );
}
function PlanModal({ plan, onApprove, onCancel }) {
  return /* @__PURE__ */ u$1("div", { class: "modal-overlay", children: /* @__PURE__ */ u$1("div", { class: "modal", children: [
    /* @__PURE__ */ u$1("div", { class: "modal-header", children: "Review Plan" }),
    /* @__PURE__ */ u$1("div", { class: "modal-body", children: [
      /* @__PURE__ */ u$1("div", { class: "plan-section", children: [
        /* @__PURE__ */ u$1("h4", { children: "Domains to visit:" }),
        /* @__PURE__ */ u$1("ul", { class: "plan-domains", children: (plan.domains || []).map((domain, i2) => /* @__PURE__ */ u$1("li", { children: domain }, i2)) })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "plan-section", children: [
        /* @__PURE__ */ u$1("h4", { children: "Approach:" }),
        /* @__PURE__ */ u$1("ul", { class: "plan-steps", children: (Array.isArray(plan.approach) ? plan.approach : [plan.approach]).map((step, i2) => /* @__PURE__ */ u$1("li", { children: step }, i2)) })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "modal-footer", children: [
      /* @__PURE__ */ u$1("button", { class: "btn btn-secondary", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ u$1("button", { class: "btn btn-primary", onClick: onApprove, children: "Approve & Continue" })
    ] })
  ] }) });
}
const EXAMPLES = [
  "Go to Gmail and unsubscribe from all marketing emails from the last week",
  "Apply for the senior engineer position on careers.acme.com",
  "Log into my bank and download last month's statement",
  "Find AI engineer jobs on LinkedIn in San Francisco"
];
function EmptyState({ onSelectExample }) {
  return /* @__PURE__ */ u$1("div", { class: "empty-state", children: [
    /* @__PURE__ */ u$1("div", { class: "empty-logo", children: /* @__PURE__ */ u$1("img", { src: "../../icons/icon-128.png", alt: "BrowserMemex" }) }),
    /* @__PURE__ */ u$1("p", { children: "Describe what you want to accomplish and the AI will browse autonomously to complete your task." }),
    /* @__PURE__ */ u$1("div", { class: "empty-examples", children: EXAMPLES.map((example, i2) => /* @__PURE__ */ u$1(
      "button",
      {
        class: "example-chip",
        onClick: () => onSelectExample(example),
        children: example
      },
      i2
    )) })
  ] });
}
function callRpc(type, args) {
  return new Promise((resolve, reject) => {
    var _a;
    const target = typeof globalThis.browser !== "undefined" && ((_a = globalThis.browser) == null ? void 0 : _a.runtime) ? globalThis.browser : chrome;
    target.runtime.sendMessage({ type, args }, (response) => {
      if (target.runtime.lastError) {
        reject(new Error(target.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error(`No response for ${type}`));
        return;
      }
      if (response.ok) resolve(response.result);
      else reject(new Error(response.error || `RPC ${type} failed`));
    });
  });
}
function useServicesRpc() {
  return T(
    () => ({
      tasks: {
        list: (args) => callRpc("services.tasks.list", args),
        get: (id) => callRpc("services.tasks.get", { id }),
        create: (spec) => callRpc("services.tasks.create", spec),
        cancel: (id) => callRpc("services.tasks.cancel", { id }),
        pause: (id) => callRpc("services.tasks.pause", { id }),
        resume: (id) => callRpc("services.tasks.resume", { id }),
        runs: (id, limit) => callRpc("services.tasks.runs", { id, limit }),
        trackerSamples: (id, limit) => callRpc("services.tasks.trackerSamples", { id, limit })
      },
      memory: {
        query: (text, options) => callRpc("services.memory.query", { text, options }),
        get: (id) => callRpc("services.memory.get", { id }),
        count: () => callRpc("services.memory.count"),
        provenance: (id) => callRpc("services.memory.provenance", { id }),
        promote: (id, tier) => callRpc("services.memory.promote", { id, tier })
      },
      skills: {
        list: (args) => callRpc("services.skills.list", args),
        get: (id) => callRpc("services.skills.get", { id }),
        getByName: (name) => callRpc("services.skills.getByName", { name }),
        create: (spec) => callRpc("services.skills.create", spec),
        update: (id, patch) => callRpc("services.skills.update", { id, patch }),
        archive: (id) => callRpc("services.skills.archive", { id }),
        delete: (id) => callRpc("services.skills.delete", { id }),
        runs: (id, limit) => callRpc("services.skills.runs", { id, limit }),
        exportSkill: (id) => callRpc("services.skills.export", { id }),
        importEnvelope: (envelope) => callRpc("services.skills.import", { envelope }),
        run: (id, inputs) => callRpc("services.skills.run", { id, inputs }),
        proposeFromTrajectory: (trajectory) => callRpc("services.skills.proposeFromTrajectory", { trajectory }),
        confirmProposal: (proposal, name, description) => callRpc("services.skills.confirmProposal", { proposal, name, description })
      },
      agents: {
        availability: () => callRpc("services.agents.availability"),
        invalidateAvailability: () => callRpc("services.agents.invalidateAvailability")
      },
      tabContext: {
        collect: (opts) => callRpc("services.tabContext.collect", opts ?? {})
      },
      profiles: {
        list: () => callRpc("services.profiles.list"),
        get: (id) => callRpc("services.profiles.get", { id }),
        getActive: () => callRpc("services.profiles.getActive"),
        setActive: (id) => callRpc("services.profiles.setActive", { id }),
        create: (spec) => callRpc("services.profiles.create", spec),
        update: (id, patch) => callRpc("services.profiles.update", { id, patch }),
        delete: (id) => callRpc("services.profiles.delete", { id }),
        duplicate: (id, newName) => callRpc("services.profiles.duplicate", { id, newName })
      }
    }),
    []
  );
}
function SaveAsSkillBanner({ trajectory, onDismiss }) {
  var _a, _b;
  const rpc = useServicesRpc();
  const [busy, setBusy] = d(false);
  const [error, setError] = d(null);
  const [savedSkill, setSavedSkill] = d(null);
  const [name, setName] = d(((_a = trajectory == null ? void 0 : trajectory.title) == null ? void 0 : _a.slice(0, 60)) ?? "New skill");
  const [editing, setEditing] = d(false);
  if (!trajectory || savedSkill) {
    return savedSkill ? /* @__PURE__ */ u$1("div", { className: "bmx-save-banner bmx-save-banner--done", children: [
      /* @__PURE__ */ u$1("span", { children: [
        "Saved as skill: ",
        /* @__PURE__ */ u$1("strong", { children: savedSkill.name })
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", onClick: onDismiss, children: "Dismiss" })
    ] }) : null;
  }
  const onSave = async () => {
    setBusy(true);
    setError(null);
    try {
      const proposal = await rpc.skills.proposeFromTrajectory(trajectory);
      const skill = await rpc.skills.confirmProposal(proposal, name.trim());
      setSavedSkill(skill);
    } catch (e2) {
      setError(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ u$1("div", { className: "bmx-save-banner", children: [
    /* @__PURE__ */ u$1("div", { className: "bmx-save-banner__main", children: [
      /* @__PURE__ */ u$1("strong", { children: "Save this run as a skill?" }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
        ((_b = trajectory.steps) == null ? void 0 : _b.length) ?? 0,
        " step(s) recorded. Once saved, any agent connected via MCP can re-run it via ",
        /* @__PURE__ */ u$1("code", { children: "memex_skills_run" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-save-banner__actions", children: [
      editing ? /* @__PURE__ */ u$1(
        "input",
        {
          type: "text",
          value: name,
          onInput: (e2) => setName(e2.currentTarget.value),
          placeholder: "Skill name",
          autoFocus: true
        }
      ) : /* @__PURE__ */ u$1("button", { type: "button", onClick: () => setEditing(true), children: [
        "Name: ",
        name
      ] }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          className: "bmx-btn bmx-btn--primary",
          onClick: onSave,
          disabled: busy || !name.trim(),
          children: busy ? "Saving…" : "Save"
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "button", onClick: onDismiss, children: "Not now" })
    ] }),
    error && /* @__PURE__ */ u$1("div", { className: "bmx-error", children: error })
  ] });
}
let _subscriber = null;
function emit(req) {
  if (typeof _subscriber === "function") _subscriber(req);
  else req.resolve(req.kind === "confirm" ? false : null);
}
function subscribeDialog(cb) {
  _subscriber = cb;
  return () => {
    if (_subscriber === cb) _subscriber = null;
  };
}
function showConfirm(message, opts = {}) {
  return new Promise((resolve) => {
    emit({ kind: "confirm", message, opts, resolve });
  });
}
function showPrompt(message, defaultValue = "", opts = {}) {
  return new Promise((resolve) => {
    emit({ kind: "prompt", message, defaultValue, opts, resolve });
  });
}
function initialsFor$1(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
function RailProfileMenu({ onManage }) {
  const rpc = useServicesRpc();
  const [open, setOpen] = d(false);
  const [profiles, setProfiles] = d([]);
  const [active, setActive] = d(null);
  const [stats, setStats] = d(null);
  const [error, setError] = d(null);
  const rootRef = A(null);
  const loadProfiles = q(async () => {
    try {
      const [list, a2] = await Promise.all([rpc.profiles.list(), rpc.profiles.getActive()]);
      setProfiles(list);
      setActive(a2);
      setError(null);
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc]);
  const loadStats = q(async () => {
    try {
      const [skills, tasks, nuggetCount] = await Promise.all([
        rpc.skills.list({ limit: 200 }).catch(() => []),
        rpc.tasks.list({ limit: 200 }).catch(() => []),
        rpc.memory.count().catch(() => 0)
      ]);
      setStats({
        skills: Array.isArray(skills) ? skills.length : 0,
        tasks: Array.isArray(tasks) ? tasks.length : 0,
        nuggets: typeof nuggetCount === "number" ? nuggetCount : 0
      });
    } catch {
      setStats(null);
    }
  }, [rpc]);
  y(() => {
    loadProfiles();
  }, [loadProfiles]);
  y(() => {
    if (open) loadStats();
  }, [open, loadStats]);
  y(() => {
    if (!open) return void 0;
    const onClick = (e2) => {
      if (rootRef.current && !rootRef.current.contains(e2.target)) setOpen(false);
    };
    const onKey = (e2) => {
      if (e2.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const handleSwitch = q(
    async (id) => {
      if (!id || id === (active == null ? void 0 : active.id)) {
        setOpen(false);
        return;
      }
      try {
        await rpc.profiles.setActive(id);
        setOpen(false);
        await loadProfiles();
        window.dispatchEvent(new CustomEvent("browser-memex.profile-changed", { detail: { id } }));
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, active, loadProfiles]
  );
  const handleCreate = q(async () => {
    const name = await showPrompt("Name for this profile", "", {
      title: "New profile",
      placeholder: "e.g. Work, Personal, Research",
      okLabel: "Create"
    });
    if (!(name == null ? void 0 : name.trim())) return;
    try {
      const created = await rpc.profiles.create({ name: name.trim() });
      await loadProfiles();
      await handleSwitch(created.id);
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc, loadProfiles, handleSwitch]);
  if (!active) {
    return /* @__PURE__ */ u$1("div", { className: "bmx-rail__profile", ref: rootRef, children: /* @__PURE__ */ u$1(
      "span",
      {
        className: "bmx-rail__avatar bmx-rail__avatar--loading",
        "aria-label": "Loading profile",
        title: "Loading profile",
        children: "?"
      }
    ) });
  }
  return /* @__PURE__ */ u$1("div", { className: "bmx-rail__profile", ref: rootRef, children: [
    /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        className: `bmx-rail__avatar ${open ? "bmx-rail__avatar--open" : ""}`,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        title: `${active.name} — switch profile`,
        onClick: () => setOpen((o2) => !o2),
        children: initialsFor$1(active.name)
      }
    ),
    open && /* @__PURE__ */ u$1("div", { className: "bmx-profile-popover", role: "menu", children: [
      /* @__PURE__ */ u$1("div", { className: "bmx-profile-popover__header", children: [
        /* @__PURE__ */ u$1(
          "span",
          {
            className: "bmx-profile-popover__big-avatar",
            "aria-hidden": "true",
            children: initialsFor$1(active.name)
          }
        ),
        /* @__PURE__ */ u$1("div", { className: "bmx-profile-popover__heading", children: [
          /* @__PURE__ */ u$1("div", { className: "bmx-profile-popover__name", children: active.name }),
          stats && /* @__PURE__ */ u$1("div", { className: "bmx-profile-popover__stats", children: [
            stats.skills,
            " skills · ",
            stats.tasks,
            " tasks · ",
            stats.nuggets,
            " nuggets"
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ u$1("div", { className: "bmx-error", style: { margin: "6px 10px" }, children: error }),
      /* @__PURE__ */ u$1("ul", { className: "bmx-profile-popover__list", role: "none", children: profiles.map((p2) => /* @__PURE__ */ u$1("li", { role: "none", children: /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          role: "menuitemradio",
          "aria-checked": p2.id === active.id,
          className: "bmx-profile-popover__item " + (p2.id === active.id ? "bmx-profile-popover__item--active" : ""),
          onClick: () => handleSwitch(p2.id),
          children: [
            /* @__PURE__ */ u$1(
              "span",
              {
                className: "bmx-profile-popover__row-avatar",
                "aria-hidden": "true",
                children: initialsFor$1(p2.name)
              }
            ),
            /* @__PURE__ */ u$1("span", { className: "bmx-profile-popover__row-name", children: p2.name }),
            p2.id === active.id && /* @__PURE__ */ u$1("span", { className: "bmx-profile-popover__check", "aria-hidden": "true", children: "✓" })
          ]
        }
      ) }, p2.id)) }),
      /* @__PURE__ */ u$1("div", { className: "bmx-profile-popover__divider" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          className: "bmx-profile-popover__item bmx-profile-popover__item--ghost",
          onClick: handleCreate,
          children: [
            /* @__PURE__ */ u$1("span", { className: "bmx-profile-popover__row-avatar bmx-profile-popover__row-avatar--plus", children: "+" }),
            /* @__PURE__ */ u$1("span", { className: "bmx-profile-popover__row-name", children: "New profile" })
          ]
        }
      ),
      typeof onManage === "function" && /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          className: "bmx-profile-popover__item bmx-profile-popover__item--ghost",
          onClick: () => {
            setOpen(false);
            onManage();
          },
          children: [
            /* @__PURE__ */ u$1("span", { className: "bmx-profile-popover__row-avatar bmx-profile-popover__row-avatar--ghost", children: "⚙" }),
            /* @__PURE__ */ u$1("span", { className: "bmx-profile-popover__row-name", children: "Manage profiles…" })
          ]
        }
      )
    ] })
  ] });
}
const ICONS = {
  chat: /* @__PURE__ */ u$1(
    "path",
    {
      d: "M3 5.5C3 4.12 4.12 3 5.5 3h9C15.88 3 17 4.12 17 5.5v6c0 1.38-1.12 2.5-2.5 2.5H8l-3.5 3v-3H5.5C4.12 14 3 12.88 3 11.5v-6z",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinejoin: "round"
    }
  ),
  tasks: /* @__PURE__ */ u$1(
    "path",
    {
      d: "M10 2.5l-5 8h3.5l-1 7 5-8H9l1-7z",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinejoin: "round"
    }
  ),
  memory: /* @__PURE__ */ u$1(
    "path",
    {
      d: "M4 4.5C4 3.67 4.67 3 5.5 3H15v13H5.5C4.67 16 4 15.33 4 14.5v-10zM4 14.5C4 13.67 4.67 13 5.5 13H15",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }
  ),
  skills: /* @__PURE__ */ u$1("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round", strokeLinecap: "round", children: /* @__PURE__ */ u$1("path", { d: "M12.5 3a3.5 3.5 0 00-3 5.3L3.4 14.4a1.4 1.4 0 102 2L11.7 10A3.5 3.5 0 0016 6.5c0-.5-.1-1-.3-1.4l-2 2-1.8-1.8 2-2A3.5 3.5 0 0012.5 3z" }) }),
  agents: /* @__PURE__ */ u$1("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round", children: [
    /* @__PURE__ */ u$1("rect", { x: "4", y: "6", width: "12", height: "9", rx: "2" }),
    /* @__PURE__ */ u$1("path", { d: "M10 3v3", strokeLinecap: "round" }),
    /* @__PURE__ */ u$1("circle", { cx: "10", cy: "3", r: "0.8", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ u$1("circle", { cx: "8", cy: "10", r: "1", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ u$1("circle", { cx: "12", cy: "10", r: "1", fill: "currentColor", stroke: "none" })
  ] }),
  registry: /* @__PURE__ */ u$1("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round", children: [
    /* @__PURE__ */ u$1("path", { d: "M10 3l6 3v7l-6 3-6-3V6l6-3z" }),
    /* @__PURE__ */ u$1("path", { d: "M4 6l6 3 6-3M10 9v7" })
  ] }),
  settings: /* @__PURE__ */ u$1("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round", children: [
    /* @__PURE__ */ u$1("circle", { cx: "10", cy: "10", r: "2.3" }),
    /* @__PURE__ */ u$1("path", { d: "M10 2v2M10 16v2M18 10h-2M4 10H2M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4M15.5 15.5l-1.4-1.4M5.9 5.9L4.5 4.5", strokeLinecap: "round" })
  ] })
};
const DEFAULT_TABS = Object.freeze([
  { id: "tasks", label: "Tasks" },
  { id: "memory", label: "Memory" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "Agents" },
  { id: "registry", label: "Registry" },
  { id: "settings", label: "Settings" }
]);
function RailItem({ tab, active, onSelect }) {
  return /* @__PURE__ */ u$1(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": active,
      "aria-label": tab.label,
      className: "bmx-rail__item " + (active ? "bmx-rail__item--active" : ""),
      onClick: () => onSelect(tab.id),
      children: [
        /* @__PURE__ */ u$1("span", { className: "bmx-rail__icon", "aria-hidden": "true", children: /* @__PURE__ */ u$1("svg", { viewBox: "0 0 20 20", width: "20", height: "20", children: ICONS[tab.id] ?? null }) }),
        /* @__PURE__ */ u$1("span", { className: "bmx-rail__label", children: tab.label })
      ]
    }
  );
}
function TabBar({ active, onSelect, extraTabs = [], onManageProfiles }) {
  const all = [...extraTabs, ...DEFAULT_TABS];
  return /* @__PURE__ */ u$1("nav", { className: "bmx-rail", role: "tablist", "aria-label": "Side panel navigation", children: [
    /* @__PURE__ */ u$1("div", { className: "bmx-rail__group", children: all.map((tab) => /* @__PURE__ */ u$1(
      RailItem,
      {
        tab,
        active: active === tab.id,
        onSelect
      },
      tab.id
    )) }),
    /* @__PURE__ */ u$1("div", { className: "bmx-rail__spacer", "aria-hidden": "true" }),
    /* @__PURE__ */ u$1(RailProfileMenu, { onManage: onManageProfiles })
  ] });
}
function DialogHost() {
  var _a, _b, _c, _d, _e, _f;
  const [req, setReq] = d(null);
  const [value, setValue] = d("");
  const inputRef = A(null);
  const okBtnRef = A(null);
  const close = q(
    (result) => {
      if (!req) return;
      req.resolve(result);
      setReq(null);
      setValue("");
    },
    [req]
  );
  y(() => {
    return subscribeDialog((next) => {
      setReq(next);
      setValue((next == null ? void 0 : next.defaultValue) ?? "");
    });
  }, []);
  y(() => {
    if (!req) return void 0;
    const t2 = setTimeout(() => {
      var _a2, _b2;
      if (req.kind === "prompt") (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
      else (_b2 = okBtnRef.current) == null ? void 0 : _b2.focus();
    }, 20);
    const onKey = (e2) => {
      if (e2.key === "Escape") {
        e2.preventDefault();
        close(req.kind === "alert" ? void 0 : req.kind === "confirm" ? false : null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t2);
      document.removeEventListener("keydown", onKey);
    };
  }, [req, close]);
  if (!req) return null;
  const onOk = () => {
    if (req.kind === "alert") close(void 0);
    else if (req.kind === "confirm") close(true);
    else close(value);
  };
  const onCancel = () => {
    close(req.kind === "confirm" ? false : null);
  };
  const okLabel = ((_a = req.opts) == null ? void 0 : _a.okLabel) ?? (req.kind === "alert" ? "OK" : req.kind === "confirm" ? "Confirm" : "Save");
  const cancelLabel = ((_b = req.opts) == null ? void 0 : _b.cancelLabel) ?? "Cancel";
  const isDestructive = !!((_c = req.opts) == null ? void 0 : _c.destructive);
  return /* @__PURE__ */ u$1(
    "div",
    {
      class: "bmx-dialog-overlay",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": ((_d = req.opts) == null ? void 0 : _d.title) ?? "Dialog",
      onClick: (e2) => {
        if (e2.target === e2.currentTarget) onCancel();
      },
      children: /* @__PURE__ */ u$1("div", { class: "bmx-dialog", children: [
        ((_e = req.opts) == null ? void 0 : _e.title) && /* @__PURE__ */ u$1("div", { class: "bmx-dialog__title", children: req.opts.title }),
        /* @__PURE__ */ u$1("p", { class: "bmx-dialog__message", children: req.message }),
        req.kind === "prompt" && /* @__PURE__ */ u$1(
          "input",
          {
            ref: inputRef,
            type: "text",
            class: "bmx-dialog__input",
            value,
            placeholder: ((_f = req.opts) == null ? void 0 : _f.placeholder) ?? "",
            onInput: (e2) => setValue(e2.currentTarget.value),
            onKeyDown: (e2) => {
              if (e2.key === "Enter") {
                e2.preventDefault();
                close(value);
              }
            }
          }
        ),
        /* @__PURE__ */ u$1("div", { class: "bmx-dialog__actions", children: [
          req.kind !== "alert" && /* @__PURE__ */ u$1("button", { type: "button", class: "bmx-btn", onClick: onCancel, children: cancelLabel }),
          /* @__PURE__ */ u$1(
            "button",
            {
              ref: okBtnRef,
              type: "button",
              class: `bmx-btn bmx-btn--primary ${isDestructive ? "bmx-btn--danger" : ""}`,
              onClick: onOk,
              children: okLabel
            }
          )
        ] })
      ] })
    }
  );
}
function ToastHost() {
  const [toasts, setToasts] = d([]);
  y(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t2) => t2.id !== toast.id));
      }, toast.durationMs);
    });
  }, []);
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ u$1("div", { class: "bmx-toast-host", "aria-live": "polite", "aria-atomic": "true", children: toasts.map((t2) => /* @__PURE__ */ u$1("div", { class: `bmx-toast bmx-toast--${t2.kind}`, children: t2.message }, t2.id)) });
}
const EVENT_NAME = "browser-memex.profile-changed";
function useProfileChange(cb) {
  y(() => {
    if (typeof cb !== "function") return void 0;
    const handler = (e2) => {
      var _a;
      return cb(((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.id) ?? null);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [cb]);
}
const TASK_KINDS = [
  { id: "one_shot", label: "One-shot" },
  { id: "scheduled", label: "Scheduled" },
  { id: "recurring", label: "Recurring (every N hours)" },
  { id: "watcher", label: "Watcher (notify on condition)" },
  { id: "tracker", label: "Tracker (record values)" }
];
const CAPABILITIES = [
  { id: "read_only", label: "Read only" },
  { id: "read_with_network", label: "Read + network" },
  { id: "write_dom", label: "Write DOM" },
  { id: "write_network", label: "Write network (prompt)" },
  { id: "destructive", label: "Destructive (always prompt)" }
];
function TasksTab() {
  const rpc = useServicesRpc();
  const [tasks, setTasks] = d([]);
  const [showCreate, setShowCreate] = d(false);
  const [selected, setSelected] = d(null);
  const [error, setError] = d(null);
  const refresh = q(async () => {
    try {
      const list = await rpc.tasks.list({ limit: 100 });
      setTasks(list);
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc]);
  y(() => {
    refresh();
  }, [refresh]);
  useProfileChange(refresh);
  const onCreate = q(
    async (spec) => {
      try {
        await rpc.tasks.create(spec);
        setShowCreate(false);
        await refresh();
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, refresh]
  );
  if (selected) {
    return /* @__PURE__ */ u$1(TaskDetail, { taskId: selected, onClose: () => setSelected(null), rpc });
  }
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("h2", { children: "Tasks" }),
      /* @__PURE__ */ u$1("button", { type: "button", onClick: () => setShowCreate(true), className: "bmx-btn bmx-btn--primary", children: "+ New task" })
    ] }),
    error && /* @__PURE__ */ u$1("div", { className: "bmx-error", children: error }),
    showCreate && /* @__PURE__ */ u$1(CreateTaskForm, { onCreate, onCancel: () => setShowCreate(false) }),
    /* @__PURE__ */ u$1(TaskList, { tasks, onSelect: setSelected, onRefresh: refresh, rpc })
  ] });
}
function TaskList({ tasks, onSelect, onRefresh, rpc }) {
  if (tasks.length === 0) {
    return /* @__PURE__ */ u$1("div", { className: "bmx-empty", children: /* @__PURE__ */ u$1("p", { children: "No tasks yet. Use “+ New task” above to schedule one." }) });
  }
  return /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: tasks.map((t2) => /* @__PURE__ */ u$1("li", { className: `bmx-list__item bmx-status--${t2.status}`, children: [
    /* @__PURE__ */ u$1("button", { className: "bmx-list__main", onClick: () => onSelect(t2.id), children: [
      /* @__PURE__ */ u$1("div", { className: "bmx-list__title", children: t2.title }),
      /* @__PURE__ */ u$1("div", { className: "bmx-list__meta", children: [
        /* @__PURE__ */ u$1("span", { children: t2.kind }),
        /* @__PURE__ */ u$1("span", { children: "·" }),
        /* @__PURE__ */ u$1("span", { children: t2.status }),
        t2.nextRunAt && /* @__PURE__ */ u$1(S, { children: [
          /* @__PURE__ */ u$1("span", { children: "·" }),
          /* @__PURE__ */ u$1("span", { children: [
            "next: ",
            new Date(t2.nextRunAt).toLocaleString()
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-list__actions", children: [
      t2.status === "pending" && /* @__PURE__ */ u$1("button", { onClick: () => rpc.tasks.pause(t2.id).then(onRefresh), children: "Pause" }),
      t2.status === "paused" && /* @__PURE__ */ u$1("button", { onClick: () => rpc.tasks.resume(t2.id).then(onRefresh), children: "Resume" }),
      t2.status !== "completed" && t2.status !== "cancelled" && /* @__PURE__ */ u$1("button", { onClick: () => rpc.tasks.cancel(t2.id).then(onRefresh), children: "Cancel" })
    ] })
  ] }, t2.id)) });
}
function CreateTaskForm({ onCreate, onCancel }) {
  const rpc = useServicesRpc();
  const [title, setTitle] = d("");
  const [description, setDescription] = d("");
  const [kind, setKind] = d("one_shot");
  const [url, setUrl] = d("");
  const [capability, setCapability] = d("read_with_network");
  const [intervalHours, setIntervalHours] = d(1);
  const [includeOpenTabs, setIncludeOpenTabs] = d(false);
  const [submitting, setSubmitting] = d(false);
  async function submit(e2) {
    e2.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const payload = { url: url.trim(), instruction: description.trim() };
    if (includeOpenTabs) {
      try {
        const openTabs = await rpc.tabContext.collect({ maxTabs: 25 });
        payload.openTabs = openTabs;
      } catch (err) {
        payload.openTabsError = err.message;
      }
    }
    const spec = {
      kind,
      title: title.trim() || "Untitled task",
      description: description.trim() || null,
      payload,
      capability,
      creator: "user"
    };
    if (["recurring", "watcher", "tracker"].includes(kind)) {
      spec.schedule = {
        kind: "interval",
        everyMs: Math.max(1, Number(intervalHours)) * 60 * 60 * 1e3
      };
    }
    if (kind === "watcher") {
      spec.watcher = { kind: "value_changed" };
    }
    setSubmitting(false);
    onCreate(spec);
  }
  return /* @__PURE__ */ u$1("form", { className: "bmx-form", onSubmit: submit, children: [
    /* @__PURE__ */ u$1("label", { children: [
      "Title",
      /* @__PURE__ */ u$1("input", { value: title, onInput: (e2) => setTitle(e2.currentTarget.value), required: true })
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "Description / instruction",
      /* @__PURE__ */ u$1(
        "textarea",
        {
          rows: 3,
          value: description,
          onInput: (e2) => setDescription(e2.currentTarget.value)
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "URL",
      /* @__PURE__ */ u$1("input", { type: "url", value: url, onInput: (e2) => setUrl(e2.currentTarget.value) })
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "Kind",
      /* @__PURE__ */ u$1("select", { className: "bmx-select", value: kind, onChange: (e2) => setKind(e2.currentTarget.value), children: TASK_KINDS.map((k2) => /* @__PURE__ */ u$1("option", { value: k2.id, children: k2.label }, k2.id)) })
    ] }),
    ["recurring", "watcher", "tracker"].includes(kind) && /* @__PURE__ */ u$1("label", { children: [
      "Every N hours",
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "number",
          min: 1,
          value: intervalHours,
          onInput: (e2) => setIntervalHours(e2.currentTarget.value)
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "Capability",
      /* @__PURE__ */ u$1("select", { className: "bmx-select", value: capability, onChange: (e2) => setCapability(e2.currentTarget.value), children: CAPABILITIES.map((c2) => /* @__PURE__ */ u$1("option", { value: c2.id, children: c2.label }, c2.id)) })
    ] }),
    /* @__PURE__ */ u$1("label", { className: "bmx-toggle", children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "checkbox",
          checked: includeOpenTabs,
          onChange: (e2) => setIncludeOpenTabs(e2.currentTarget.checked)
        }
      ),
      "Include my open tabs as context",
      /* @__PURE__ */ u$1("span", { className: "bmx-list__hint", children: "Sends a sanitized list of currently-open tabs (incognito and blocked-host tabs excluded; URL credentials stripped)" })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", children: [
      /* @__PURE__ */ u$1("button", { type: "button", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ u$1("button", { type: "submit", className: "bmx-btn bmx-btn--primary", disabled: submitting, children: submitting ? "Creating…" : "Create" })
    ] })
  ] });
}
function TaskDetail({ taskId, onClose, rpc }) {
  const [task, setTask] = d(null);
  const [runs, setRuns] = d([]);
  const [samples, setSamples] = d([]);
  y(() => {
    let cancelled = false;
    (async () => {
      const t2 = await rpc.tasks.get(taskId);
      if (cancelled) return;
      setTask(t2);
      const r2 = await rpc.tasks.runs(taskId, 50);
      if (cancelled) return;
      setRuns(r2);
      if ((t2 == null ? void 0 : t2.kind) === "tracker") {
        const s2 = await rpc.tasks.trackerSamples(taskId, 50);
        if (!cancelled) setSamples(s2);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [taskId, rpc]);
  if (!task) return /* @__PURE__ */ u$1("div", { className: "bmx-empty", children: "Loading…" });
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("button", { type: "button", onClick: onClose, className: "bmx-btn", children: "← Back" }),
      /* @__PURE__ */ u$1("h2", { children: task.title })
    ] }),
    /* @__PURE__ */ u$1("dl", { className: "bmx-detail", children: [
      /* @__PURE__ */ u$1("dt", { children: "Kind" }),
      /* @__PURE__ */ u$1("dd", { children: task.kind }),
      /* @__PURE__ */ u$1("dt", { children: "Status" }),
      /* @__PURE__ */ u$1("dd", { children: task.status }),
      /* @__PURE__ */ u$1("dt", { children: "Runs" }),
      /* @__PURE__ */ u$1("dd", { children: [
        task.runCount,
        " (failures: ",
        task.failureCount,
        ")"
      ] }),
      /* @__PURE__ */ u$1("dt", { children: "Created" }),
      /* @__PURE__ */ u$1("dd", { children: new Date(task.createdAt).toLocaleString() }),
      task.nextRunAt && /* @__PURE__ */ u$1(S, { children: [
        /* @__PURE__ */ u$1("dt", { children: "Next run" }),
        /* @__PURE__ */ u$1("dd", { children: new Date(task.nextRunAt).toLocaleString() })
      ] })
    ] }),
    samples.length > 0 && /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Tracker samples" }),
      /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: samples.map((s2) => /* @__PURE__ */ u$1("li", { className: "bmx-list__item", children: [
        /* @__PURE__ */ u$1("span", { children: new Date(s2.recordedAt).toLocaleString() }),
        /* @__PURE__ */ u$1("span", { children: s2.value ?? s2.text })
      ] }, s2.id)) })
    ] }),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Run history" }),
      /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: runs.map((r2) => {
        var _a, _b, _c;
        return /* @__PURE__ */ u$1("li", { className: `bmx-list__item bmx-status--${r2.status}`, children: /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("div", { children: new Date(r2.startedAt).toLocaleString() }),
          /* @__PURE__ */ u$1("div", { className: "bmx-list__meta", children: [
            r2.status,
            " ",
            ((_a = r2.routing) == null ? void 0 : _a.chosenAgentId) && `· ${r2.routing.chosenAgentId}`,
            ((_b = r2.cost) == null ? void 0 : _b.usd) != null && ` · $${r2.cost.usd.toFixed(4)}`
          ] }),
          r2.error && /* @__PURE__ */ u$1("div", { className: "bmx-error-inline", children: r2.error }),
          ((_c = r2.routing) == null ? void 0 : _c.explanation) && /* @__PURE__ */ u$1("div", { className: "bmx-list__hint", children: r2.routing.explanation })
        ] }) }, r2.id);
      }) })
    ] })
  ] });
}
function MemoryTab() {
  const rpc = useServicesRpc();
  const [count, setCount] = d(null);
  const [query, setQuery] = d("");
  const [results, setResults] = d([]);
  const [view, setView] = d("active");
  const [error, setError] = d(null);
  const refreshCount = q(() => {
    rpc.memory.count().then(setCount).catch((e2) => setError(e2.message));
  }, [rpc]);
  y(() => {
    refreshCount();
  }, [refreshCount]);
  useProfileChange(() => {
    refreshCount();
    setResults([]);
    setQuery("");
  });
  const search = q(
    async (e2) => {
      var _a;
      (_a = e2 == null ? void 0 : e2.preventDefault) == null ? void 0 : _a.call(e2);
      try {
        const hits = await rpc.memory.query(query.trim(), {
          time: Date.now(),
          view,
          topK: 50
        });
        setResults(hits);
      } catch (err) {
        setError(err.message);
      }
    },
    [rpc, query, view]
  );
  const startTagging = q(async () => {
    var _a;
    try {
      const target = typeof globalThis.browser !== "undefined" && ((_a = globalThis.browser) == null ? void 0 : _a.tabs) ? globalThis.browser : chrome;
      const [tab] = await new Promise(
        (resolve) => target.tabs.query({ active: true, currentWindow: true }, resolve)
      );
      if (!(tab == null ? void 0 : tab.id)) return;
      target.tabs.sendMessage(tab.id, { type: "bmx-tagging.start" });
    } catch (e2) {
      setError(e2.message);
    }
  }, []);
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("h2", { children: "Memory" }),
      /* @__PURE__ */ u$1("div", { className: "bmx-tab__header-actions", children: [
        count !== null && /* @__PURE__ */ u$1("span", { className: "bmx-badge", children: [
          count,
          " nuggets"
        ] }),
        /* @__PURE__ */ u$1("button", { onClick: startTagging, className: "bmx-btn", title: "Click an element on the active tab to tag it", children: "Tag element" })
      ] })
    ] }),
    error && /* @__PURE__ */ u$1("div", { className: "bmx-error", children: error }),
    /* @__PURE__ */ u$1("form", { className: "bmx-search bmx-search--with-filter", onSubmit: search, children: [
      /* @__PURE__ */ u$1("div", { className: "bmx-search__input-wrap", children: [
        /* @__PURE__ */ u$1("svg", { className: "bmx-search__icon", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: [
          /* @__PURE__ */ u$1("circle", { cx: "11", cy: "11", r: "7" }),
          /* @__PURE__ */ u$1("path", { d: "m21 21-4.3-4.3" })
        ] }),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "search",
            placeholder: "Search facts…",
            value: query,
            onInput: (e2) => setQuery(e2.currentTarget.value)
          }
        )
      ] }),
      /* @__PURE__ */ u$1(
        "select",
        {
          className: "bmx-select bmx-select--compact",
          value: view,
          onChange: (e2) => setView(e2.currentTarget.value),
          "aria-label": "Filter view",
          children: [
            /* @__PURE__ */ u$1("option", { value: "active", children: "Active only" }),
            /* @__PURE__ */ u$1("option", { value: "active_plus_contested", children: "Include contested" })
          ]
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "submit", className: "bmx-btn bmx-btn--primary", children: "Search" })
    ] }),
    results.length === 0 ? /* @__PURE__ */ u$1("div", { className: "bmx-empty bmx-empty--card", children: [
      /* @__PURE__ */ u$1("svg", { className: "bmx-empty__icon", width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ u$1("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ u$1("path", { d: "m21 21-4.3-4.3" })
      ] }),
      /* @__PURE__ */ u$1("p", { children: query ? "No matching nuggets." : "Type a query and press Search." })
    ] }) : /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: results.map(({ nugget, score }) => /* @__PURE__ */ u$1(NuggetRow, { nugget, score, rpc }, nugget.id)) })
  ] });
}
function NuggetRow({ nugget, score, rpc }) {
  const [provenance, setProvenance] = d(null);
  const [open, setOpen] = d(false);
  const [loadingProv, setLoadingProv] = d(false);
  const toggleProvenance = q(async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (provenance) return;
    setLoadingProv(true);
    try {
      const rows = await rpc.memory.provenance(nugget.id);
      setProvenance(rows || []);
    } catch {
      setProvenance([]);
    } finally {
      setLoadingProv(false);
    }
  }, [rpc, nugget.id, provenance, open]);
  return /* @__PURE__ */ u$1("li", { className: `bmx-list__item bmx-status--${nugget.epistemic.status.toLowerCase()}`, children: [
    /* @__PURE__ */ u$1("div", { className: "bmx-list__title", children: [
      nugget.fact.subject,
      " — ",
      nugget.fact.predicate,
      " — ",
      /* @__PURE__ */ u$1("strong", { children: String(nugget.fact.object) })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-list__meta", children: [
      /* @__PURE__ */ u$1("span", { children: nugget.epistemic.status }),
      /* @__PURE__ */ u$1("span", { children: "·" }),
      /* @__PURE__ */ u$1("span", { children: [
        "scope: ",
        nugget.validity.scope
      ] }),
      nugget.validity.location && /* @__PURE__ */ u$1(S, { children: [
        /* @__PURE__ */ u$1("span", { children: "·" }),
        /* @__PURE__ */ u$1("span", { children: [
          "from ",
          nugget.validity.location
        ] })
      ] }),
      /* @__PURE__ */ u$1("span", { children: "·" }),
      /* @__PURE__ */ u$1("span", { children: [
        "score: ",
        score.toFixed(2)
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-list__hint", children: [
      "Valid ",
      new Date(nugget.validity.start).toLocaleDateString(),
      " →",
      " ",
      nugget.validity.end ? new Date(nugget.validity.end).toLocaleDateString() : "∞"
    ] }),
    /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        className: `bmx-list__toggle ${open ? "is-open" : ""}`,
        onClick: toggleProvenance,
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ u$1("svg", { className: "bmx-list__toggle-caret", width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: /* @__PURE__ */ u$1("path", { d: "m9 6 6 6-6 6" }) }),
          "Sources"
        ]
      }
    ),
    open && /* @__PURE__ */ u$1("div", { className: "bmx-provenance", children: [
      loadingProv && /* @__PURE__ */ u$1("div", { className: "bmx-hint", children: "Loading sources…" }),
      !loadingProv && (provenance == null ? void 0 : provenance.length) === 0 && /* @__PURE__ */ u$1("div", { className: "bmx-hint", children: "No recorded sources." }),
      !loadingProv && (provenance == null ? void 0 : provenance.length) > 0 && /* @__PURE__ */ u$1("ul", { className: "bmx-provenance__list", children: provenance.map((p2, i2) => /* @__PURE__ */ u$1("li", { className: "bmx-provenance__item", children: [
        /* @__PURE__ */ u$1(
          "a",
          {
            href: p2.sourceUrl,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "bmx-provenance__url",
            title: p2.sourceUrl,
            children: p2.pageTitle || p2.sourceUrl
          }
        ),
        /* @__PURE__ */ u$1("div", { className: "bmx-provenance__meta", children: [
          p2.agentId && /* @__PURE__ */ u$1("span", { children: [
            "via ",
            p2.agentId
          ] }),
          p2.extractedAt && /* @__PURE__ */ u$1(S, { children: [
            p2.agentId && /* @__PURE__ */ u$1("span", { children: " · " }),
            /* @__PURE__ */ u$1("span", { children: new Date(p2.extractedAt).toLocaleString() })
          ] })
        ] })
      ] }, i2)) })
    ] })
  ] });
}
function DomainHintsSection({ config }) {
  const [skillForm, setSkillForm] = d({
    domain: "",
    skill: "",
    isOpen: false,
    editIndex: -1
  });
  const [memStats, setMemStats] = d(null);
  const [memSkills, setMemSkills] = d([]);
  y(() => {
    Promise.all([
      chrome.runtime.sendMessage({ type: "GET_MEMORY_STATS" }),
      chrome.runtime.sendMessage({ type: "GET_LEARNED_SKILLS" })
    ]).then(([s2, sk]) => {
      setMemStats(s2);
      setMemSkills(sk || []);
    }).catch(() => {
    });
  }, []);
  const persistUserSkills = async (nextSkills) => {
    await chrome.runtime.sendMessage({
      type: "SAVE_CONFIG",
      payload: {
        providerKeys: config.providerKeys,
        customModels: config.customModels,
        currentModelIndex: config.currentModelIndex,
        userSkills: nextSkills
      }
    });
    await config.loadConfig();
    notifyConfigChanged();
  };
  const handleAdd = async () => {
    if (!skillForm.domain || !skillForm.skill) {
      showToast("Please fill in both domain and tips/guidance", { kind: "error" });
      return;
    }
    const newSkill = { domain: skillForm.domain.toLowerCase(), skill: skillForm.skill };
    let next;
    if (skillForm.editIndex >= 0) {
      next = config.userSkills.map((s2, i2) => i2 === skillForm.editIndex ? newSkill : s2);
    } else {
      const existingIndex = config.userSkills.findIndex((s2) => s2.domain === newSkill.domain);
      next = [...config.userSkills];
      if (existingIndex >= 0) next[existingIndex] = newSkill;
      else next.push(newSkill);
    }
    await persistUserSkills(next);
    setSkillForm({ domain: "", skill: "", isOpen: false, editIndex: -1 });
  };
  const handleEdit = (index) => {
    const skill = config.userSkills[index];
    setSkillForm({ domain: skill.domain, skill: skill.skill, isOpen: true, editIndex: index });
  };
  const handleRemove = async (index) => {
    await persistUserSkills(config.userSkills.filter((_2, i2) => i2 !== index));
  };
  const handleClearHistory = async () => {
    const ok = await showConfirm("Clear all task history?", {
      title: "Clear task history",
      okLabel: "Clear",
      destructive: true
    });
    if (!ok) return;
    chrome.runtime.sendMessage({ type: "CLEAR_TASK_HISTORY" }).then(() => {
      chrome.runtime.sendMessage({ type: "GET_MEMORY_STATS" }).then((s2) => setMemStats(s2));
    });
  };
  const handleDeleteMemSkill = (domain) => {
    chrome.runtime.sendMessage({ type: "DELETE_LEARNED_SKILL", payload: { domain } }).then(() => {
      chrome.runtime.sendMessage({ type: "GET_LEARNED_SKILLS" }).then((sk) => setMemSkills(sk || []));
    });
  };
  return /* @__PURE__ */ u$1(S, { children: [
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Domain hints" }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "Tips to help the chat agent navigate specific websites." }),
      /* @__PURE__ */ u$1("div", { class: "settings-rows", children: [
        config.userSkills.map((skill, i2) => /* @__PURE__ */ u$1("div", { class: "settings-row", children: [
          /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
            /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: skill.domain }),
            /* @__PURE__ */ u$1("div", { class: "settings-row-sub", children: [
              skill.skill.substring(0, 60),
              "..."
            ] })
          ] }),
          /* @__PURE__ */ u$1("div", { class: "settings-row-actions", children: [
            /* @__PURE__ */ u$1("button", { class: "settings-row-action", onClick: () => handleEdit(i2), children: "Edit" }),
            /* @__PURE__ */ u$1("button", { class: "settings-row-delete", onClick: () => handleRemove(i2), children: "×" })
          ] })
        ] }, i2)),
        config.builtInSkills.map((skill, i2) => /* @__PURE__ */ u$1("div", { class: "settings-row builtin", children: /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
          /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: [
            skill.domain,
            " ",
            /* @__PURE__ */ u$1("span", { class: "settings-badge", children: "built-in" })
          ] }),
          /* @__PURE__ */ u$1("div", { class: "settings-row-sub", children: [
            skill.skill.substring(0, 60),
            "..."
          ] })
        ] }) }, `b-${i2}`)),
        !skillForm.isOpen ? /* @__PURE__ */ u$1(
          "div",
          {
            class: "settings-row add-row",
            onClick: () => setSkillForm({ domain: "", skill: "", isOpen: true, editIndex: -1 }),
            children: [
              /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: "+ Add domain hint" }),
              /* @__PURE__ */ u$1("span", { class: "settings-row-arrow", children: "›" })
            ]
          }
        ) : /* @__PURE__ */ u$1("div", { class: "settings-inline-form", children: [
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "text",
              placeholder: "Domain (e.g., github.com)",
              value: skillForm.domain,
              onInput: (e2) => setSkillForm({ ...skillForm, domain: e2.target.value })
            }
          ),
          /* @__PURE__ */ u$1(
            "textarea",
            {
              placeholder: "Tips and guidance...",
              value: skillForm.skill,
              onInput: (e2) => setSkillForm({ ...skillForm, skill: e2.target.value }),
              rows: 3
            }
          ),
          /* @__PURE__ */ u$1("div", { class: "settings-form-actions", children: [
            /* @__PURE__ */ u$1(
              "button",
              {
                class: "btn btn-secondary btn-sm",
                onClick: () => setSkillForm({ ...skillForm, isOpen: false }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ u$1("button", { class: "btn btn-primary btn-sm", onClick: handleAdd, children: skillForm.editIndex >= 0 ? "Update" : "Add" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Learned memory" }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "Auto-generated from task history." }),
      memStats && /* @__PURE__ */ u$1("div", { class: "memory-stats-row", children: [
        /* @__PURE__ */ u$1("div", { class: "memory-stat", children: [
          /* @__PURE__ */ u$1("span", { class: "memory-stat-val", children: memStats.totalTasks }),
          " tasks"
        ] }),
        /* @__PURE__ */ u$1("div", { class: "memory-stat", children: [
          /* @__PURE__ */ u$1("span", { class: "memory-stat-val", children: memStats.totalDomains }),
          " domains"
        ] }),
        /* @__PURE__ */ u$1("div", { class: "memory-stat", children: [
          /* @__PURE__ */ u$1("span", { class: "memory-stat-val", children: memStats.learnedSkillCount }),
          " skills"
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "settings-rows", children: memSkills.map((s2) => /* @__PURE__ */ u$1("div", { class: "settings-row", children: [
        /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
          /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: [
            s2.domain,
            " ",
            /* @__PURE__ */ u$1("span", { class: "settings-badge", children: s2.successRate })
          ] }),
          /* @__PURE__ */ u$1("div", { class: "settings-row-sub", children: [
            s2.skill.substring(0, 80),
            "..."
          ] })
        ] }),
        /* @__PURE__ */ u$1("button", { class: "settings-row-delete", onClick: () => handleDeleteMemSkill(s2.domain), children: "×" })
      ] }, s2.domain)) }),
      (memStats == null ? void 0 : memStats.totalTasks) > 0 && /* @__PURE__ */ u$1(
        "button",
        {
          class: "btn btn-secondary btn-sm",
          style: { marginTop: "8px" },
          onClick: handleClearHistory,
          children: "Clear task history"
        }
      )
    ] })
  ] });
}
function SkillsTab({ initialDraft, onDraftConsumed } = {}) {
  const rpc = useServicesRpc();
  const config = useConfig();
  const [skills, setSkills] = d([]);
  const [showCreate, setShowCreate] = d(false);
  const [draft, setDraft] = d(null);
  const [error, setError] = d(null);
  const [importPaste, setImportPaste] = d("");
  y(() => {
    if (initialDraft) {
      setDraft(initialDraft);
      setShowCreate(true);
      onDraftConsumed == null ? void 0 : onDraftConsumed();
    }
  }, [initialDraft]);
  const refresh = q(async () => {
    try {
      const list = await rpc.skills.list({ limit: 100 });
      setSkills(list);
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc]);
  y(() => {
    refresh();
  }, [refresh]);
  useProfileChange(refresh);
  const onCreate = q(
    async (spec) => {
      try {
        await rpc.skills.create(spec);
        setShowCreate(false);
        await refresh();
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, refresh]
  );
  const onExport = q(
    async (id) => {
      try {
        const envelope = await rpc.skills.exportSkill(id);
        await navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
        showToast("Skill envelope copied to clipboard", { kind: "success" });
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc]
  );
  const onImport = q(async () => {
    try {
      const envelope = JSON.parse(importPaste);
      await rpc.skills.importEnvelope(envelope);
      setImportPaste("");
      await refresh();
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc, importPaste, refresh]);
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("h2", { children: "Skills" }),
      /* @__PURE__ */ u$1("button", { onClick: () => setShowCreate(true), className: "bmx-btn bmx-btn--primary", children: "+ New skill" })
    ] }),
    error && /* @__PURE__ */ u$1("div", { className: "bmx-error", children: error }),
    showCreate && /* @__PURE__ */ u$1(
      CreateSkillForm,
      {
        onCreate,
        onCancel: () => {
          setShowCreate(false);
          setDraft(null);
        },
        draft
      }
    ),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Import from clipboard" }),
      /* @__PURE__ */ u$1(
        "textarea",
        {
          rows: 4,
          placeholder: 'Paste a "browser-memex.skill.v1" envelope here',
          value: importPaste,
          onInput: (e2) => setImportPaste(e2.currentTarget.value)
        }
      ),
      /* @__PURE__ */ u$1("button", { onClick: onImport, disabled: !importPaste.trim(), children: "Import" })
    ] }),
    skills.length === 0 ? /* @__PURE__ */ u$1("div", { className: "bmx-empty", children: "No skills yet." }) : /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: skills.map((s2) => /* @__PURE__ */ u$1("li", { className: `bmx-list__item bmx-status--${s2.status}`, children: [
      /* @__PURE__ */ u$1("div", { className: "bmx-list__main", children: [
        /* @__PURE__ */ u$1("div", { className: "bmx-list__title", children: s2.name }),
        /* @__PURE__ */ u$1("div", { className: "bmx-list__meta", children: [
          /* @__PURE__ */ u$1("span", { children: [
            "v",
            s2.version
          ] }),
          /* @__PURE__ */ u$1("span", { children: "·" }),
          /* @__PURE__ */ u$1("span", { children: [
            s2.steps.length,
            " step(s)"
          ] }),
          /* @__PURE__ */ u$1("span", { children: "·" }),
          /* @__PURE__ */ u$1("span", { children: [
            Math.round((s2.provenance.successRate ?? 0) * 100),
            "% success (",
            s2.provenance.confirmedRuns,
            ")"
          ] })
        ] }),
        s2.description && /* @__PURE__ */ u$1("div", { className: "bmx-list__hint", children: s2.description })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "bmx-list__actions", children: [
        /* @__PURE__ */ u$1("button", { onClick: () => onExport(s2.id), children: "Export" }),
        s2.status === "active" ? /* @__PURE__ */ u$1("button", { onClick: () => rpc.skills.archive(s2.id).then(refresh), children: "Archive" }) : /* @__PURE__ */ u$1("button", { onClick: () => rpc.skills.update(s2.id, { status: "active" }).then(refresh), children: "Unarchive" }),
        /* @__PURE__ */ u$1(
          "button",
          {
            onClick: async () => {
              const ok = await showConfirm(`Delete skill "${s2.name}"?`, {
                title: "Delete skill",
                okLabel: "Delete",
                destructive: true
              });
              if (ok) await rpc.skills.delete(s2.id).then(refresh);
            },
            children: "Delete"
          }
        )
      ] })
    ] }, s2.id)) }),
    !config.isLoading && /* @__PURE__ */ u$1(DomainHintsSection, { config })
  ] });
}
function CreateSkillForm({ onCreate, onCancel, draft }) {
  const [name, setName] = d("");
  const [description, setDescription] = d((draft == null ? void 0 : draft.description) ?? "");
  const [capability, setCapability] = d("read_with_network");
  const [domains, setDomains] = d(() => {
    if (!(draft == null ? void 0 : draft.sourceUrl)) return "";
    try {
      return new URL(draft.sourceUrl).hostname;
    } catch {
      return "";
    }
  });
  function submit(e2) {
    e2.preventDefault();
    onCreate({
      name: name.trim(),
      description: description.trim(),
      capability,
      domains: domains.split(",").map((d2) => d2.trim()).filter(Boolean),
      steps: [{ id: "step-1", kind: "run_task", params: {} }]
    });
  }
  return /* @__PURE__ */ u$1("form", { className: "bmx-form", onSubmit: submit, children: [
    /* @__PURE__ */ u$1("label", { children: [
      "Name",
      /* @__PURE__ */ u$1("input", { value: name, onInput: (e2) => setName(e2.currentTarget.value), required: true })
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "Description",
      /* @__PURE__ */ u$1(
        "textarea",
        {
          rows: 3,
          value: description,
          onInput: (e2) => setDescription(e2.currentTarget.value)
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "Capability",
      /* @__PURE__ */ u$1("select", { className: "bmx-select", value: capability, onChange: (e2) => setCapability(e2.currentTarget.value), children: [
        /* @__PURE__ */ u$1("option", { value: "read_only", children: "Read only" }),
        /* @__PURE__ */ u$1("option", { value: "read_with_network", children: "Read + network" }),
        /* @__PURE__ */ u$1("option", { value: "write_dom", children: "Write DOM" }),
        /* @__PURE__ */ u$1("option", { value: "write_network", children: "Write network" }),
        /* @__PURE__ */ u$1("option", { value: "destructive", children: "Destructive (always confirms)" })
      ] })
    ] }),
    /* @__PURE__ */ u$1("label", { children: [
      "Authorized domains (comma-separated)",
      /* @__PURE__ */ u$1("input", { value: domains, onInput: (e2) => setDomains(e2.currentTarget.value), placeholder: "example.com, api.example.com" })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", children: [
      /* @__PURE__ */ u$1("button", { type: "button", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ u$1("button", { type: "submit", className: "bmx-btn bmx-btn--primary", children: "Create" })
    ] })
  ] });
}
function ModelsSection({ config }) {
  const [selectedProvider, setSelectedProvider] = d(null);
  const [localKeys, setLocalKeys] = d({ ...config.providerKeys });
  const [keysDirty, setKeysDirty] = d(false);
  const [newCustomModel, setNewCustomModel] = d({
    name: "",
    baseUrl: "",
    modelId: "",
    apiKey: ""
  });
  const [showCustomForm, setShowCustomForm] = d(false);
  const handleKeyInput = (id, value) => {
    setLocalKeys({ ...localKeys, [id]: value });
    setKeysDirty(true);
  };
  const handleSaveKeys = async () => {
    await chrome.runtime.sendMessage({
      type: "SAVE_CONFIG",
      payload: {
        providerKeys: localKeys,
        customModels: config.customModels,
        currentModelIndex: config.currentModelIndex,
        userSkills: config.userSkills
      }
    });
    await config.loadConfig();
    notifyConfigChanged();
    setKeysDirty(false);
    showToast("API keys saved", { kind: "success" });
  };
  const handleAddCustomModel = async () => {
    if (!newCustomModel.name || !newCustomModel.baseUrl || !newCustomModel.modelId) {
      showToast("Fill in name, base URL, and model ID", { kind: "error" });
      return;
    }
    const nextCustom = [...config.customModels, { ...newCustomModel }];
    await chrome.runtime.sendMessage({
      type: "SAVE_CONFIG",
      payload: {
        providerKeys: localKeys,
        customModels: nextCustom,
        currentModelIndex: config.currentModelIndex,
        userSkills: config.userSkills
      }
    });
    await config.loadConfig();
    notifyConfigChanged();
    setNewCustomModel({ name: "", baseUrl: "", modelId: "", apiKey: "" });
    setShowCustomForm(false);
    showToast(`Added "${nextCustom[nextCustom.length - 1].name}"`, { kind: "success" });
  };
  const handleRemoveCustom = async (index) => {
    const nextCustom = config.customModels.filter((_2, i2) => i2 !== index);
    await chrome.runtime.sendMessage({
      type: "SAVE_CONFIG",
      payload: {
        providerKeys: localKeys,
        customModels: nextCustom,
        currentModelIndex: config.currentModelIndex,
        userSkills: config.userSkills
      }
    });
    await config.loadConfig();
    notifyConfigChanged();
  };
  return /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
    /* @__PURE__ */ u$1("h3", { children: "Model providers" }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "API keys for the LLM that powers the chat." }),
    /* @__PURE__ */ u$1("div", { class: "settings-rows", children: Object.entries(PROVIDERS).map(([id, provider]) => /* @__PURE__ */ u$1("div", { children: [
      /* @__PURE__ */ u$1(
        "div",
        {
          class: `settings-row ${selectedProvider === id ? "selected" : ""}`,
          onClick: () => setSelectedProvider(selectedProvider === id ? null : id),
          children: [
            /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
              /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: provider.name }),
              /* @__PURE__ */ u$1("div", { class: `settings-row-sub ${localKeys[id] ? "ok" : ""}`, children: localKeys[id] ? "Configured" : "Not configured" })
            ] }),
            localKeys[id] ? /* @__PURE__ */ u$1("span", { class: "settings-row-check", children: "✓" }) : /* @__PURE__ */ u$1("span", { class: "settings-row-arrow", children: "›" })
          ]
        }
      ),
      selectedProvider === id && /* @__PURE__ */ u$1("div", { class: "settings-key-input", children: /* @__PURE__ */ u$1(
        "input",
        {
          type: "password",
          value: localKeys[id] || "",
          onInput: (e2) => handleKeyInput(id, e2.target.value),
          placeholder: `${provider.name} API key...`
        }
      ) })
    ] }, id)) }),
    keysDirty && /* @__PURE__ */ u$1("div", { class: "bmx-form__actions", style: { marginTop: 8 }, children: /* @__PURE__ */ u$1("button", { onClick: handleSaveKeys, className: "bmx-btn bmx-btn--primary", children: "Save API keys" }) }),
    /* @__PURE__ */ u$1("div", { class: "settings-section-label", style: { marginTop: 16 }, children: "Custom endpoints" }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "OpenAI-compatible HTTP endpoints (Ollama, vLLM, etc.)." }),
    /* @__PURE__ */ u$1("div", { class: "settings-rows", children: [
      config.customModels.map((model, i2) => /* @__PURE__ */ u$1("div", { class: "settings-row", children: [
        /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
          /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: model.name }),
          /* @__PURE__ */ u$1("div", { class: "settings-row-sub ok", children: model.baseUrl })
        ] }),
        /* @__PURE__ */ u$1("button", { class: "settings-row-delete", onClick: () => handleRemoveCustom(i2), children: "×" })
      ] }, i2)),
      !showCustomForm ? /* @__PURE__ */ u$1("div", { class: "settings-row add-row", onClick: () => setShowCustomForm(true), children: [
        /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
          /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: "+ Add custom model" }),
          /* @__PURE__ */ u$1("div", { class: "settings-row-sub", children: "OpenAI-compatible endpoint" })
        ] }),
        /* @__PURE__ */ u$1("span", { class: "settings-row-arrow", children: "›" })
      ] }) : /* @__PURE__ */ u$1("div", { class: "settings-inline-form", children: [
        /* @__PURE__ */ u$1("p", { className: "bmx-hint", style: { margin: "0 0 4px" }, children: [
          "OpenAI-compatible endpoint. The host alone is fine (e.g. ",
          /* @__PURE__ */ u$1("code", { children: "https://llms.example.edu" }),
          " or",
          /* @__PURE__ */ u$1("code", { children: "http://localhost:11434" }),
          ") — we'll append",
          /* @__PURE__ */ u$1("code", { children: "/v1/chat/completions" }),
          " automatically."
        ] }),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            placeholder: "Display name — e.g. Innkube Llama-3",
            value: newCustomModel.name,
            onInput: (e2) => setNewCustomModel({ ...newCustomModel, name: e2.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            placeholder: "Base URL — host, host/v1, or full /v1/chat/completions",
            value: newCustomModel.baseUrl,
            onInput: (e2) => setNewCustomModel({ ...newCustomModel, baseUrl: e2.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            placeholder: "Model ID — the exact string the server expects",
            value: newCustomModel.modelId,
            onInput: (e2) => setNewCustomModel({ ...newCustomModel, modelId: e2.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "password",
            placeholder: "API key (optional — leave blank for unauthenticated)",
            value: newCustomModel.apiKey,
            onInput: (e2) => setNewCustomModel({ ...newCustomModel, apiKey: e2.target.value })
          }
        ),
        /* @__PURE__ */ u$1("div", { class: "settings-form-actions", children: [
          /* @__PURE__ */ u$1("button", { class: "btn btn-secondary btn-sm", onClick: () => setShowCustomForm(false), children: "Cancel" }),
          /* @__PURE__ */ u$1("button", { class: "btn btn-primary btn-sm", onClick: handleAddCustomModel, children: "Add" })
        ] })
      ] })
    ] })
  ] });
}
const AGENTS = {
  "claude-code": {
    label: "Claude Code",
    docs: "https://docs.claude.com/claude-code/mcp",
    configPath: "~/.config/claude-code/config.json (or via /mcp command)",
    snippet: {
      mcpServers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  cursor: {
    label: "Cursor",
    docs: "https://docs.cursor.com/context/mcp",
    configPath: "~/.cursor/mcp.json",
    snippet: {
      mcpServers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  codex: {
    label: "Codex CLI",
    docs: "https://github.com/openai/codex",
    configPath: "~/.codex/config.toml",
    snippet: {
      kind: "toml",
      text: `[mcp_servers.browser-memex]
command = "npx"
args = ["-y", "@browser-memex/mcp-server"]
`
    }
  },
  "gemini-cli": {
    label: "Gemini CLI",
    docs: "https://github.com/google-gemini/gemini-cli",
    configPath: "~/.gemini/settings.json",
    snippet: {
      mcpServers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  vscode: {
    label: "VS Code (GitHub Copilot)",
    docs: "https://code.visualstudio.com/docs/copilot/customization/mcp-servers",
    configPath: ".vscode/mcp.json or User settings.json",
    snippet: {
      servers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  windsurf: {
    label: "Windsurf",
    docs: "https://docs.windsurf.com/windsurf/cascade/mcp",
    configPath: "~/.codeium/windsurf/mcp_config.json",
    snippet: {
      mcpServers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  cline: {
    label: "Cline",
    docs: "https://docs.cline.bot/mcp/mcp-overview",
    configPath: "Cline → Settings → MCP Servers → Edit JSON",
    snippet: {
      mcpServers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  "roo-code": {
    label: "Roo Code",
    docs: "https://docs.roocode.com/features/mcp/using-mcp-in-roo",
    configPath: "Roo Code → MCP Settings → mcp_settings.json",
    snippet: {
      mcpServers: {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  },
  amp: {
    label: "Amp",
    docs: "https://ampcode.com/manual#mcp",
    configPath: 'VS Code settings → "amp.mcpServers"',
    snippet: {
      "amp.mcpServers": {
        "browser-memex": {
          command: "npx",
          args: ["-y", "@browser-memex/mcp-server"]
        }
      }
    }
  }
};
function snippetText(agentId) {
  var _a;
  const a2 = AGENTS[agentId];
  if (!a2) return "";
  if (((_a = a2.snippet) == null ? void 0 : _a.kind) === "toml") return a2.snippet.text;
  return JSON.stringify(a2.snippet, null, 2);
}
function ConnectAgentWizard({ agentId, onClose }) {
  const [copied, setCopied] = d(false);
  const agent = AGENTS[agentId];
  if (!agent) {
    return /* @__PURE__ */ u$1("div", { className: "bmx-modal-overlay", onClick: onClose, children: /* @__PURE__ */ u$1("div", { className: "bmx-modal", onClick: (e2) => e2.stopPropagation(), children: [
      /* @__PURE__ */ u$1("header", { className: "bmx-modal__header", children: [
        /* @__PURE__ */ u$1("h3", { children: "Connect agent" }),
        /* @__PURE__ */ u$1("button", { className: "bmx-modal__close", onClick: onClose, "aria-label": "Close", children: "×" })
      ] }),
      /* @__PURE__ */ u$1("p", { children: [
        'No connector definition for agent "',
        agentId,
        '".'
      ] })
    ] }) });
  }
  const text = snippetText(agentId);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };
  return /* @__PURE__ */ u$1("div", { className: "bmx-modal-overlay", onClick: onClose, children: /* @__PURE__ */ u$1("div", { className: "bmx-modal", onClick: (e2) => e2.stopPropagation(), children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-modal__header", children: [
      /* @__PURE__ */ u$1("h3", { children: [
        "Connect ",
        agent.label,
        " to BrowserMemex"
      ] }),
      /* @__PURE__ */ u$1("button", { className: "bmx-modal__close", onClick: onClose, "aria-label": "Close", children: "×" })
    ] }),
    /* @__PURE__ */ u$1("ol", { className: "bmx-modal__steps", children: [
      /* @__PURE__ */ u$1("li", { children: [
        "Open your ",
        agent.label,
        " MCP configuration:",
        /* @__PURE__ */ u$1("code", { className: "bmx-modal__path", children: agent.configPath })
      ] }),
      /* @__PURE__ */ u$1("li", { children: [
        "Paste this snippet under ",
        /* @__PURE__ */ u$1("code", { children: "mcpServers" }),
        " (merging with any existing servers):",
        /* @__PURE__ */ u$1("pre", { className: "bmx-modal__snippet", children: text }),
        /* @__PURE__ */ u$1("button", { className: "bmx-btn", onClick: handleCopy, children: copied ? "Copied!" : "Copy snippet" })
      ] }),
      /* @__PURE__ */ u$1("li", { children: [
        "Restart ",
        agent.label,
        ". The new tools — ",
        /* @__PURE__ */ u$1("code", { children: "memex_memory_query" }),
        ",",
        " ",
        /* @__PURE__ */ u$1("code", { children: "memex_skills_list" }),
        ", ",
        /* @__PURE__ */ u$1("code", { children: "memex_skills_run" }),
        ",",
        " ",
        /* @__PURE__ */ u$1("code", { children: "memex_tasks_list" }),
        ", ",
        /* @__PURE__ */ u$1("code", { children: "memex_tasks_create" }),
        ",",
        " ",
        /* @__PURE__ */ u$1("code", { children: "memex_profile_active" }),
        " — should appear."
      ] }),
      /* @__PURE__ */ u$1("li", { children: [
        "Verify by asking the agent: ",
        /* @__PURE__ */ u$1("em", { children: '"Use memex_profile_active to tell me which BrowserMemex profile is active."' })
      ] })
    ] }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
      "Reference: ",
      /* @__PURE__ */ u$1("a", { href: agent.docs, target: "_blank", rel: "noreferrer", children: [
        agent.label,
        " MCP docs"
      ] })
    ] })
  ] }) });
}
const AGENT_DISPLAY = {
  "claude-code": { name: "Claude Code", vendor: "Anthropic" },
  cursor: { name: "Cursor", vendor: "Anysphere" },
  codex: { name: "Codex CLI", vendor: "OpenAI" },
  "gemini-cli": { name: "Gemini CLI", vendor: "Google" },
  vscode: { name: "Visual Studio Code", vendor: "Microsoft" },
  windsurf: { name: "Windsurf", vendor: "Codeium" },
  cline: { name: "Cline", vendor: "Cline" },
  "roo-code": { name: "Roo Code", vendor: "Roo Veterinary Inc." },
  amp: { name: "Amp", vendor: "Sourcegraph" }
};
const ALL_IDS = Object.keys(AGENT_DISPLAY);
function AgentsTab() {
  const rpc = useServicesRpc();
  const config = useConfig();
  const [availability, setAvailability] = d(null);
  const [error, setError] = d(null);
  const [loading, setLoading] = d(true);
  const [connectingAgentId, setConnectingAgentId] = d(null);
  const load = q(async () => {
    setLoading(true);
    try {
      const a2 = await rpc.agents.availability();
      setAvailability(a2);
      setError(null);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  }, [rpc]);
  y(() => {
    load();
  }, [load]);
  const refresh = q(async () => {
    await rpc.agents.invalidateAvailability();
    await load();
  }, [rpc, load]);
  if (loading && !availability) {
    return /* @__PURE__ */ u$1("div", { className: "bmx-empty", children: "Loading agents…" });
  }
  const installed = new Set((availability == null ? void 0 : availability.installed) ?? []);
  const configured = new Set((availability == null ? void 0 : availability.configured) ?? []);
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("h2", { children: "Agents" }),
      /* @__PURE__ */ u$1("button", { onClick: refresh, className: "bmx-btn", children: "Refresh" })
    ] }),
    error && /* @__PURE__ */ u$1("div", { className: "bmx-error", children: error }),
    !config.isLoading && /* @__PURE__ */ u$1(ModelsSection, { config }),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Coding agents" }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
        "External AI coding tools BrowserMemex can connect to. Detection runs via the MCP server. Install BrowserMemex into an agent with ",
        /* @__PURE__ */ u$1("code", { children: "llm-browser agents install <id>" }),
        "."
      ] }),
      /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: ALL_IDS.map((id) => {
        const meta = AGENT_DISPLAY[id];
        const isInstalled = installed.has(id);
        const isConfigured = configured.has(id);
        return /* @__PURE__ */ u$1("li", { className: "bmx-list__item", children: [
          /* @__PURE__ */ u$1("div", { className: "bmx-list__main", children: [
            /* @__PURE__ */ u$1("div", { className: "bmx-list__title", children: [
              meta.name,
              isInstalled && /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--ok", children: " installed" }),
              isConfigured && /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--ok", children: " configured" }),
              !isInstalled && /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--muted", children: " not detected" })
            ] }),
            /* @__PURE__ */ u$1("div", { className: "bmx-list__meta", children: meta.vendor })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "bmx-list__actions", children: /* @__PURE__ */ u$1(
            "button",
            {
              className: "bmx-btn",
              onClick: () => setConnectingAgentId(id),
              children: "Connect"
            }
          ) })
        ] }, id);
      }) })
    ] }),
    connectingAgentId && /* @__PURE__ */ u$1(
      ConnectAgentWizard,
      {
        agentId: connectingAgentId,
        onClose: () => setConnectingAgentId(null)
      }
    )
  ] });
}
const TRANSPORT = Object.freeze({
  STDIO: "stdio",
  HTTP: "http",
  SSE: "sse"
});
const INSTALL_KIND = Object.freeze({
  NPX: "npx",
  NPM_GLOBAL: "npm_global",
  DOCKER: "docker",
  BINARY: "binary",
  PYTHON: "python",
  CUSTOM: "custom"
});
function validateDescriptor(d2) {
  if (!d2) throw new Error("descriptor required");
  if (typeof d2.id !== "string" || !d2.id.length) throw new Error(`${d2.id}: id required`);
  if (typeof d2.displayName !== "string") throw new Error(`${d2.id}: displayName required`);
  if (typeof d2.vendor !== "string") throw new Error(`${d2.id}: vendor required`);
  if (!Object.values(TRANSPORT).includes(d2.transport)) {
    throw new Error(`${d2.id}: invalid transport`);
  }
  if (!d2.install || typeof d2.install !== "object") {
    throw new Error(`${d2.id}: install required`);
  }
  if (!Object.values(INSTALL_KIND).includes(d2.install.kind)) {
    throw new Error(`${d2.id}: invalid install.kind`);
  }
  if (typeof d2.install.command !== "string" || !d2.install.command.length) {
    throw new Error(`${d2.id}: install.command required`);
  }
  if (!Array.isArray(d2.install.args)) {
    throw new Error(`${d2.id}: install.args must be an array`);
  }
  return true;
}
const filesystem = Object.freeze({
  id: "filesystem",
  displayName: "Filesystem",
  vendor: "Model Context Protocol",
  description: "Read and write files in user-allowed directories.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
  tags: ["filesystem", "official"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true, resources: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "<ALLOWED_DIRECTORY>"],
    requiredEnv: []
  },
  official: true
});
const github = Object.freeze({
  id: "github",
  displayName: "GitHub",
  vendor: "GitHub",
  description: "Search issues + PRs, read repos, comment, create PRs.",
  homepage: "https://github.com/github/github-mcp-server",
  repository: "https://github.com/github/github-mcp-server",
  tags: ["development", "code", "issue-tracker"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true },
  install: {
    kind: INSTALL_KIND.DOCKER,
    command: "docker",
    args: ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: "<YOUR_GH_PAT>" },
    requiredEnv: ["GITHUB_PERSONAL_ACCESS_TOKEN"]
  },
  official: false
});
const sqlite = Object.freeze({
  id: "sqlite",
  displayName: "SQLite",
  vendor: "Model Context Protocol",
  description: "Query a SQLite database; useful for app-local data exploration.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
  tags: ["database", "official"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true, resources: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "<DB_PATH>"],
    requiredEnv: []
  },
  official: true
});
const postgres = Object.freeze({
  id: "postgres",
  displayName: "PostgreSQL",
  vendor: "Model Context Protocol",
  description: "Read-only access to a PostgreSQL database; great for analytics agents.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
  tags: ["database", "official"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true, resources: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-postgres", "<DATABASE_URL>"],
    requiredEnv: []
  },
  official: true
});
const slack = Object.freeze({
  id: "slack",
  displayName: "Slack",
  vendor: "Model Context Protocol",
  description: "Send messages, read channels, manage threads in Slack workspaces.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
  tags: ["communication", "official"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-slack"],
    env: {
      SLACK_BOT_TOKEN: "<xoxb-...>",
      SLACK_TEAM_ID: "<TEAM_ID>"
    },
    requiredEnv: ["SLACK_BOT_TOKEN", "SLACK_TEAM_ID"]
  },
  official: true
});
const fetch$1 = Object.freeze({
  id: "fetch",
  displayName: "Fetch (HTTP)",
  vendor: "Model Context Protocol",
  description: "Fetch web pages and convert them to markdown for LLM consumption.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/fetch",
  tags: ["web", "official", "extraction"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true },
  install: {
    kind: INSTALL_KIND.PYTHON,
    command: "uvx",
    args: ["mcp-server-fetch"],
    requiredEnv: []
  },
  official: true
});
const braveSearch = Object.freeze({
  id: "brave-search",
  displayName: "Brave Search",
  vendor: "Model Context Protocol",
  description: "Web and local search via the Brave Search API.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
  tags: ["search", "official", "web"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-brave-search"],
    env: { BRAVE_API_KEY: "<YOUR_BRAVE_API_KEY>" },
    requiredEnv: ["BRAVE_API_KEY"]
  },
  official: true
});
const googleDrive = Object.freeze({
  id: "google-drive",
  displayName: "Google Drive",
  vendor: "Model Context Protocol",
  description: "Read and search files in Google Drive (OAuth required).",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive",
  tags: ["productivity", "official", "google"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true, resources: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-gdrive"],
    requiredEnv: []
  },
  official: true
});
const linear = Object.freeze({
  id: "linear",
  displayName: "Linear",
  vendor: "Linear",
  description: "Create, query, and update Linear issues from an agent.",
  homepage: "https://linear.app/changelog/mcp",
  tags: ["issue-tracker", "productivity"],
  transport: TRANSPORT.SSE,
  capabilities: { tools: true },
  install: {
    kind: INSTALL_KIND.CUSTOM,
    command: "https://mcp.linear.app/sse",
    args: [],
    env: { LINEAR_API_KEY: "<YOUR_LINEAR_API_KEY>" },
    requiredEnv: ["LINEAR_API_KEY"]
  },
  official: false
});
const memory = Object.freeze({
  id: "memory",
  displayName: "Persistent Memory (knowledge graph)",
  vendor: "Model Context Protocol",
  description: "Store and recall facts across sessions as a typed knowledge graph.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
  tags: ["memory", "official"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-memory"],
    requiredEnv: []
  },
  official: true
});
const notion = Object.freeze({
  id: "notion",
  displayName: "Notion",
  vendor: "Notion",
  description: "Read, search, and update Notion pages and databases.",
  homepage: "https://github.com/makenotion/notion-mcp-server",
  repository: "https://github.com/makenotion/notion-mcp-server",
  tags: ["productivity", "wiki"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true, resources: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@notionhq/notion-mcp-server"],
    env: {
      OPENAPI_MCP_HEADERS: '{"Authorization":"Bearer <NOTION_INTEGRATION_SECRET>","Notion-Version":"2022-06-28"}'
    },
    requiredEnv: ["OPENAPI_MCP_HEADERS"]
  },
  official: false
});
const everything = Object.freeze({
  id: "everything",
  displayName: "Everything (reference server)",
  vendor: "Model Context Protocol",
  description: "Reference MCP server demonstrating every protocol feature (tools / prompts / resources / sampling). Useful for testing your client integration.",
  homepage: "https://github.com/modelcontextprotocol/servers",
  repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/everything",
  tags: ["reference", "testing", "official"],
  transport: TRANSPORT.STDIO,
  capabilities: { tools: true, prompts: true, resources: true, sampling: true },
  install: {
    kind: INSTALL_KIND.NPX,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-everything"],
    requiredEnv: []
  },
  official: true
});
const _all = [
  filesystem,
  github,
  sqlite,
  postgres,
  slack,
  fetch$1,
  braveSearch,
  googleDrive,
  linear,
  memory,
  notion,
  everything
];
for (const d2 of _all) validateDescriptor(d2);
const ALL_MCP_SERVERS = Object.freeze(_all);
function searchServers(query) {
  const q2 = String(query ?? "").toLowerCase().trim();
  if (q2.length === 0) return [...ALL_MCP_SERVERS];
  return ALL_MCP_SERVERS.filter((s2) => {
    const haystack = [
      s2.displayName,
      s2.description,
      s2.vendor,
      ...s2.tags ?? []
    ].join(" ").toLowerCase();
    return haystack.includes(q2);
  });
}
function buildConfigEntry(server) {
  const entry = {
    command: server.install.command,
    args: [...server.install.args]
  };
  if (server.install.env && Object.keys(server.install.env).length > 0) {
    entry.env = { ...server.install.env };
  }
  return entry;
}
function RegistryTab() {
  const [query, setQuery] = d("");
  const [tag, setTag] = d("");
  const [expanded, setExpanded] = d(null);
  const [copied, setCopied] = d(null);
  const allTags = T(() => {
    const s2 = /* @__PURE__ */ new Set();
    for (const srv of ALL_MCP_SERVERS) for (const t2 of srv.tags ?? []) s2.add(t2);
    return [...s2].sort();
  }, []);
  const filtered = T(() => {
    let r2 = searchServers(query);
    if (tag) r2 = r2.filter((s2) => (s2.tags ?? []).includes(tag));
    return r2;
  }, [query, tag]);
  async function copyConfig(server) {
    const entry = buildConfigEntry(server);
    const json = JSON.stringify(
      { mcpServers: { [server.id]: entry } },
      null,
      2
    );
    await navigator.clipboard.writeText(json);
    setCopied(server.id);
    setTimeout(() => setCopied((c2) => c2 === server.id ? null : c2), 2e3);
  }
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("h2", { children: "MCP Server Registry" }),
      /* @__PURE__ */ u$1("span", { className: "bmx-badge", children: [
        filtered.length,
        " servers"
      ] })
    ] }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
      "Curated catalog of MCP servers your connected agents can use. Click “Copy config” and paste the snippet into your agent's ",
      /* @__PURE__ */ u$1("code", { children: "mcpServers" }),
      " map."
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-search", children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "search",
          placeholder: "Filter servers…",
          value: query,
          onInput: (e2) => setQuery(e2.currentTarget.value)
        }
      ),
      /* @__PURE__ */ u$1("select", { className: "bmx-select bmx-select--compact", value: tag, onChange: (e2) => setTag(e2.currentTarget.value), children: [
        /* @__PURE__ */ u$1("option", { value: "", children: "All tags" }),
        allTags.map((t2) => /* @__PURE__ */ u$1("option", { value: t2, children: t2 }, t2))
      ] })
    ] }),
    /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: filtered.map((s2) => {
      const isOpen = expanded === s2.id;
      return /* @__PURE__ */ u$1("li", { className: "bmx-list__item", children: [
        /* @__PURE__ */ u$1("div", { className: "bmx-list__main", children: [
          /* @__PURE__ */ u$1("div", { className: "bmx-list__title", children: [
            s2.displayName,
            s2.official && /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--ok", children: " official" })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "bmx-list__meta", children: [
            /* @__PURE__ */ u$1("span", { children: s2.vendor }),
            /* @__PURE__ */ u$1("span", { children: "·" }),
            /* @__PURE__ */ u$1("span", { children: s2.transport }),
            (s2.tags ?? []).map((t2) => /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--muted", children: t2 }, t2))
          ] }),
          /* @__PURE__ */ u$1("div", { className: "bmx-list__hint", children: s2.description })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "bmx-list__actions", children: [
          /* @__PURE__ */ u$1("button", { onClick: () => copyConfig(s2), children: copied === s2.id ? "Copied ✓" : "Copy config" }),
          /* @__PURE__ */ u$1("button", { onClick: () => setExpanded(isOpen ? null : s2.id), children: isOpen ? "Hide" : "Show JSON" }),
          s2.homepage && /* @__PURE__ */ u$1("a", { href: s2.homepage, target: "_blank", rel: "noreferrer noopener", className: "bmx-btn", children: "Docs" })
        ] }),
        isOpen && /* @__PURE__ */ u$1("pre", { className: "bmx-pre", children: JSON.stringify({ mcpServers: { [s2.id]: buildConfigEntry(s2) } }, null, 2) }),
        (s2.install.requiredEnv ?? []).length > 0 && /* @__PURE__ */ u$1("div", { className: "bmx-list__hint", children: [
          "⚠ Requires env vars: ",
          s2.install.requiredEnv.join(", ")
        ] })
      ] }, s2.id);
    }) })
  ] });
}
const STORAGE_KEY = "browser-memex.theme";
function loadInitial() {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY);
    if (v2 === "light" || v2 === "dark" || v2 === "auto") return v2;
  } catch {
  }
  return "auto";
}
function resolvedDarkFor(pref, mediaPrefersDark) {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return mediaPrefersDark;
}
function useTheme() {
  const [pref, setPref] = d(loadInitial);
  const [systemDark, setSystemDark] = d(() => {
    if (typeof matchMedia === "undefined") return false;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  });
  y(() => {
    if (typeof matchMedia === "undefined") return void 0;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e2) => setSystemDark(e2.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  y(() => {
    const isDark = resolvedDarkFor(pref, systemDark);
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
  }, [pref, systemDark]);
  const setTheme = q((value) => {
    if (!["auto", "light", "dark"].includes(value)) return;
    setPref(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
    }
  }, []);
  return {
    pref,
    isDark: resolvedDarkFor(pref, systemDark),
    setTheme
  };
}
function DeveloperSection() {
  const [loggingEnabled, setLoggingEnabled] = d(false);
  const [logs, setLogs] = d([]);
  const [loading, setLoading] = d(true);
  const [exporting, setExporting] = d(false);
  y(() => {
    chrome.storage.local.get("detailedLogging").then(({ detailedLogging }) => {
      setLoggingEnabled(!!detailedLogging);
    });
    loadLogs();
  }, []);
  const loadLogs = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ type: "LIST_TASK_LOGS" }).then((res) => {
      setLogs((res == null ? void 0 : res.logs) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  const handleToggle = (enabled) => {
    setLoggingEnabled(enabled);
    chrome.storage.local.set({ detailedLogging: enabled });
  };
  const handleExport = () => {
    setExporting(true);
    chrome.runtime.sendMessage({ type: "EXPORT_TASK_LOGS" }).then((res) => {
      if (res == null ? void 0 : res.data) {
        const blob = new Blob([res.data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a2 = document.createElement("a");
        a2.href = url;
        a2.download = `browser-memex-logs-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
        a2.click();
        URL.revokeObjectURL(url);
      }
      setExporting(false);
    }).catch(() => setExporting(false));
  };
  const handleClear = async () => {
    const ok = await showConfirm("Delete all stored logs?", {
      title: "Clear logs",
      okLabel: "Delete",
      destructive: true
    });
    if (!ok) return;
    chrome.runtime.sendMessage({ type: "CLEAR_TASK_LOGS" }).then(() => setLogs([]));
  };
  return /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
    /* @__PURE__ */ u$1("h3", { children: "Developer" }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "Detailed logging for debugging task runs." }),
    /* @__PURE__ */ u$1("div", { class: "settings-rows", children: /* @__PURE__ */ u$1("div", { class: "settings-row", children: [
      /* @__PURE__ */ u$1("div", { class: "settings-row-info", children: [
        /* @__PURE__ */ u$1("div", { class: "settings-row-name", children: "Detailed logging" }),
        /* @__PURE__ */ u$1("div", { class: "settings-row-sub", children: "Captures full step traces to local storage" })
      ] }),
      /* @__PURE__ */ u$1("label", { class: "toggle-switch", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: loggingEnabled,
            onChange: (e2) => handleToggle(e2.target.checked)
          }
        ),
        /* @__PURE__ */ u$1("span", { class: "toggle-slider" })
      ] })
    ] }) }),
    loggingEnabled && /* @__PURE__ */ u$1(S, { children: [
      /* @__PURE__ */ u$1("div", { class: "dev-log-summary", children: loading ? "Loading..." : `${logs.length} log(s) stored` }),
      logs.length > 0 && /* @__PURE__ */ u$1("div", { class: "dev-log-list", children: logs.slice(0, 15).map((l2) => {
        var _a, _b;
        return /* @__PURE__ */ u$1("div", { class: "dev-log-item", children: [
          /* @__PURE__ */ u$1("div", { class: "dev-log-task", children: [
            ((_a = l2.task) == null ? void 0 : _a.substring(0, 50)) || "(no task)",
            ((_b = l2.task) == null ? void 0 : _b.length) > 50 ? "..." : ""
          ] }),
          /* @__PURE__ */ u$1("div", { class: "dev-log-meta", children: [
            /* @__PURE__ */ u$1("span", { class: `dev-log-status ${l2.status}`, children: l2.status }),
            l2.duration && /* @__PURE__ */ u$1("span", { children: l2.duration })
          ] })
        ] }, l2.folder);
      }) }),
      /* @__PURE__ */ u$1("div", { class: "settings-form-actions", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            class: "btn btn-secondary btn-sm",
            onClick: handleExport,
            disabled: exporting || logs.length === 0,
            children: exporting ? "Exporting..." : "Export"
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            class: "btn btn-danger btn-sm",
            onClick: handleClear,
            disabled: logs.length === 0,
            children: "Clear"
          }
        )
      ] })
    ] })
  ] });
}
function initialsFor(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
function ManageProfilesSection({ rpc, onChange }) {
  const [profiles, setProfiles] = d([]);
  const [active, setActive] = d(null);
  const [editingId, setEditingId] = d(null);
  const [editingName, setEditingName] = d("");
  const [error, setError] = d(null);
  const refresh = q(async () => {
    try {
      const [list, a2] = await Promise.all([
        rpc.profiles.list(),
        rpc.profiles.getActive()
      ]);
      setProfiles(list);
      setActive(a2);
      setError(null);
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc]);
  y(() => {
    refresh();
  }, [refresh]);
  const handleCreate = q(async () => {
    const name = await showPrompt("Name for the new profile", "", {
      title: "New profile",
      placeholder: "e.g. Work, Personal, Research",
      okLabel: "Create"
    });
    if (!(name == null ? void 0 : name.trim())) return;
    try {
      await rpc.profiles.create({ name: name.trim() });
      await refresh();
      onChange == null ? void 0 : onChange();
    } catch (e2) {
      setError(e2.message);
    }
  }, [rpc, refresh, onChange]);
  const handleDuplicate = q(
    async (p2) => {
      const newName = await showPrompt(`Duplicate "${p2.name}" as`, `${p2.name} (copy)`, {
        title: "Duplicate profile",
        okLabel: "Duplicate"
      });
      if (!(newName == null ? void 0 : newName.trim())) return;
      try {
        await rpc.profiles.duplicate(p2.id, newName.trim());
        await refresh();
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, refresh]
  );
  const handleDelete = q(
    async (p2) => {
      const ok = await showConfirm(
        `Delete profile "${p2.name}"?

Tasks, skills, and memory tied to this profile will become orphaned.`,
        { title: "Delete profile", okLabel: "Delete", destructive: true }
      );
      if (!ok) return;
      try {
        await rpc.profiles.delete(p2.id);
        await refresh();
        onChange == null ? void 0 : onChange();
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, refresh, onChange]
  );
  const handleSwitch = q(
    async (id) => {
      try {
        await rpc.profiles.setActive(id);
        await refresh();
        onChange == null ? void 0 : onChange();
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, refresh, onChange]
  );
  const handleExport = q(
    async (p2) => {
      const fresh = await rpc.profiles.get(p2.id);
      const envelope = {
        type: "browser-memex.profile.v1",
        exportedAt: Date.now(),
        profile: fresh
      };
      try {
        await navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
        setError(null);
        setEditingId(null);
        showToast(`Profile "${p2.name}" copied to clipboard`, { kind: "success" });
      } catch (e2) {
        setError(`Couldn't copy to clipboard: ${e2.message}`);
      }
    },
    [rpc]
  );
  const handleStartRename = (p2) => {
    setEditingId(p2.id);
    setEditingName(p2.name);
  };
  const handleCommitRename = q(
    async (p2) => {
      const trimmed = editingName.trim();
      if (!trimmed || trimmed === p2.name) {
        setEditingId(null);
        return;
      }
      try {
        await rpc.profiles.update(p2.id, { name: trimmed });
        setEditingId(null);
        await refresh();
        onChange == null ? void 0 : onChange();
      } catch (e2) {
        setError(e2.message);
      }
    },
    [rpc, editingName, refresh, onChange]
  );
  return /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
    /* @__PURE__ */ u$1("h3", { children: "Profiles" }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "A profile is a workspace — its own routing policy, privacy, skills, tasks, and memory. Switching profiles swaps every per-profile thing at once." }),
    error && /* @__PURE__ */ u$1("div", { className: "bmx-error", children: error }),
    /* @__PURE__ */ u$1("ul", { className: "bmx-profile-list", children: profiles.map((p2) => {
      const isActive = (active == null ? void 0 : active.id) === p2.id;
      return /* @__PURE__ */ u$1("li", { className: `bmx-profile-list__item ${isActive ? "bmx-profile-list__item--active" : ""}`, children: [
        /* @__PURE__ */ u$1(
          "span",
          {
            className: "bmx-profile-list__avatar",
            "aria-hidden": "true",
            children: initialsFor(p2.name)
          }
        ),
        /* @__PURE__ */ u$1("div", { className: "bmx-profile-list__main", children: editingId === p2.id ? /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            autoFocus: true,
            value: editingName,
            onInput: (e2) => setEditingName(e2.currentTarget.value),
            onBlur: () => handleCommitRename(p2),
            onKeyDown: (e2) => {
              if (e2.key === "Enter") handleCommitRename(p2);
              if (e2.key === "Escape") setEditingId(null);
            }
          }
        ) : /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            className: "bmx-profile-list__name",
            onClick: () => handleSwitch(p2.id),
            title: isActive ? "Active profile" : "Switch to this profile",
            children: [
              p2.name,
              isActive && /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--ok", children: " active" })
            ]
          }
        ) }),
        /* @__PURE__ */ u$1("div", { className: "bmx-profile-list__actions", children: [
          /* @__PURE__ */ u$1("button", { onClick: () => handleStartRename(p2), title: "Rename", children: "Rename" }),
          /* @__PURE__ */ u$1("button", { onClick: () => handleDuplicate(p2), title: "Duplicate", children: "Duplicate" }),
          /* @__PURE__ */ u$1("button", { onClick: () => handleExport(p2), title: "Copy JSON envelope to clipboard", children: "Export" }),
          /* @__PURE__ */ u$1(
            "button",
            {
              onClick: () => handleDelete(p2),
              disabled: isActive || profiles.length <= 1,
              title: isActive ? "Switch profile first" : "Delete profile",
              children: "Delete"
            }
          )
        ] })
      ] }, p2.id);
    }) }),
    /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", style: { marginTop: 8 }, children: /* @__PURE__ */ u$1("button", { onClick: handleCreate, className: "bmx-btn bmx-btn--primary", children: "+ New profile" }) })
  ] });
}
const STATE_LABEL = {
  connected: "Connected",
  connecting: "Connecting…",
  disconnected: "Not connected"
};
function isRemoteHost(url) {
  try {
    const u2 = new URL(url);
    const h2 = u2.hostname.toLowerCase();
    return h2 !== "localhost" && h2 !== "127.0.0.1" && h2 !== "::1" && h2 !== "[::1]";
  } catch {
    return false;
  }
}
function RelaySection() {
  const [status, setStatus] = d({ url: "", state: "disconnected", defaultUrl: "" });
  const [draft, setDraft] = d("");
  const [saving, setSaving] = d(false);
  const [error, setError] = d(null);
  const refresh = q(async () => {
    try {
      const s2 = await chrome.runtime.sendMessage({ type: "GET_RELAY_STATUS" });
      if (s2) {
        setStatus(s2);
        setDraft((prev) => prev === "" ? s2.url : prev);
      }
    } catch {
    }
  }, []);
  y(() => {
    refresh();
    const id = setInterval(refresh, 4e3);
    return () => clearInterval(id);
  }, [refresh]);
  const dirty = draft.trim() !== "" && draft.trim() !== status.url;
  const isDefault = !status.url || status.url === status.defaultUrl;
  const draftIsRemote = isRemoteHost(draft || status.url);
  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await chrome.runtime.sendMessage({
        type: "SET_RELAY_URL",
        payload: { url: draft.trim() }
      });
      if (!(res == null ? void 0 : res.success)) {
        setError((res == null ? void 0 : res.error) || "Could not save relay URL");
        showToast((res == null ? void 0 : res.error) || "Could not save relay URL", { kind: "error" });
        return;
      }
      setStatus({ url: res.url, state: res.state, defaultUrl: res.defaultUrl });
      setDraft(res.url);
      showToast("Relay URL saved", { kind: "success" });
    } finally {
      setSaving(false);
    }
  };
  const handleReset = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await chrome.runtime.sendMessage({
        type: "SET_RELAY_URL",
        payload: { url: "" }
      });
      if (res == null ? void 0 : res.success) {
        setStatus({ url: res.url, state: res.state, defaultUrl: res.defaultUrl });
        setDraft(res.url);
        showToast("Reverted to default relay", { kind: "success" });
      }
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
    /* @__PURE__ */ u$1("h3", { children: "MCP relay" }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "The WebSocket the extension listens on for tasks from Claude Code, Cursor, or the CLI. Change this to pair with a relay on another machine over LAN or Tailscale." }),
    /* @__PURE__ */ u$1("div", { className: "relay-status-row", children: [
      /* @__PURE__ */ u$1("span", { className: `relay-pill relay-pill--${status.state}`, children: [
        /* @__PURE__ */ u$1("span", { className: "relay-pill__dot" }),
        STATE_LABEL[status.state] ?? "Unknown"
      ] }),
      /* @__PURE__ */ u$1("code", { className: "relay-status-url", title: status.url, children: status.url || "—" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          className: "bmx-btn relay-refresh-btn",
          onClick: refresh,
          "aria-label": "Refresh relay status",
          title: "Refresh",
          children: "↻"
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { className: "relay-field", children: [
      /* @__PURE__ */ u$1("span", { className: "relay-field__label", children: "Relay URL" }),
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "text",
          spellcheck: false,
          autoCapitalize: "off",
          autoCorrect: "off",
          value: draft,
          placeholder: status.defaultUrl || "ws://localhost:7862",
          onInput: (e2) => setDraft(e2.currentTarget.value),
          className: "relay-input"
        }
      )
    ] }),
    draftIsRemote && /* @__PURE__ */ u$1("p", { className: "relay-warning", children: [
      "Heads up — the relay has no auth and the ",
      /* @__PURE__ */ u$1("code", { children: "ws://" }),
      " traffic is unencrypted. Only point this at a remote host over a trusted network (LAN, Tailscale, VPN)."
    ] }),
    error && /* @__PURE__ */ u$1("p", { className: "bmx-error", style: { marginTop: 6 }, children: error }),
    /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", children: [
      !isDefault && /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          className: "bmx-btn",
          onClick: handleReset,
          disabled: saving,
          children: "Reset to default"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          className: "bmx-btn bmx-btn--primary",
          onClick: handleSave,
          disabled: !dirty || saving,
          children: saving ? "Saving…" : "Save & reconnect"
        }
      )
    ] })
  ] });
}
const DEFAULT_POLICY = {
  rules: [],
  fallback: "claude-code",
  overrides: [],
  llmFallbackEnabled: false
};
const DEFAULT_PRIVACY = { memoryEnabled: true, disabledDomains: [] };
function SettingsTab() {
  const rpc = useServicesRpc();
  const { pref: themePref, setTheme } = useTheme();
  const [activeProfile, setActiveProfile] = d(null);
  const [policyJson, setPolicyJson] = d(JSON.stringify(DEFAULT_POLICY, null, 2));
  const [privacy, setPrivacy] = d(DEFAULT_PRIVACY);
  const [domainsText, setDomainsText] = d("");
  const [status, setStatus] = d(null);
  const loadActive = q(async () => {
    const p2 = await rpc.profiles.getActive();
    setActiveProfile(p2);
    setPolicyJson(JSON.stringify(p2.policy ?? DEFAULT_POLICY, null, 2));
    const pv = p2.privacy ?? DEFAULT_PRIVACY;
    setPrivacy(pv);
    setDomainsText((pv.disabledDomains ?? []).join("\n"));
  }, [rpc]);
  y(() => {
    loadActive().catch((e2) => setStatus(`Error: ${e2.message}`));
  }, [loadActive]);
  useProfileChange(loadActive);
  const savePolicy = q(async () => {
    try {
      const parsed = JSON.parse(policyJson);
      if (!Array.isArray(parsed.rules)) throw new Error("policy.rules must be an array");
      if (typeof parsed.fallback !== "string") throw new Error("policy.fallback must be a string");
      await rpc.profiles.update(activeProfile.id, { policy: parsed });
      await loadActive();
      setStatus("Policy saved for this profile. Applies on next service-worker reload.");
    } catch (e2) {
      setStatus(`Error: ${e2.message}`);
    }
  }, [policyJson, rpc, activeProfile, loadActive]);
  const savePrivacy = q(async () => {
    const domains = domainsText.split("\n").map((d2) => d2.trim()).filter(Boolean);
    const next = { ...privacy, disabledDomains: domains };
    await rpc.profiles.update(activeProfile.id, { privacy: next });
    setPrivacy(next);
    setStatus("Privacy settings saved for this profile.");
  }, [privacy, domainsText, rpc, activeProfile]);
  return /* @__PURE__ */ u$1("div", { className: "bmx-tab", children: [
    /* @__PURE__ */ u$1("header", { className: "bmx-tab__header", children: [
      /* @__PURE__ */ u$1("h2", { children: "Settings" }),
      activeProfile && /* @__PURE__ */ u$1("span", { className: "bmx-badge bmx-badge--muted", children: [
        "Profile: ",
        activeProfile.name
      ] })
    ] }),
    status && /* @__PURE__ */ u$1("div", { className: status.startsWith("Error") ? "bmx-error" : "bmx-success", children: status }),
    /* @__PURE__ */ u$1(ManageProfilesSection, { rpc, onChange: loadActive }),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Routing policy" }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
        "Edit the Router policy as JSON. Format: ",
        /* @__PURE__ */ u$1("code", { children: `{ rules, fallback, overrides?, llmFallbackEnabled? }` })
      ] }),
      /* @__PURE__ */ u$1(
        "textarea",
        {
          rows: 14,
          spellcheck: false,
          value: policyJson,
          onInput: (e2) => setPolicyJson(e2.currentTarget.value),
          style: { fontFamily: "ui-monospace, monospace", fontSize: 12 }
        }
      ),
      /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", children: [
        /* @__PURE__ */ u$1("button", { onClick: () => setPolicyJson(JSON.stringify(DEFAULT_POLICY, null, 2)), children: "Reset" }),
        /* @__PURE__ */ u$1("button", { onClick: savePolicy, className: "bmx-btn bmx-btn--primary", children: "Save policy" })
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Privacy" }),
      /* @__PURE__ */ u$1("label", { className: "bmx-toggle", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: privacy.memoryEnabled,
            onChange: (e2) => setPrivacy({ ...privacy, memoryEnabled: e2.currentTarget.checked })
          }
        ),
        "Capture memory while agents browse"
      ] }),
      /* @__PURE__ */ u$1("label", { children: [
        "Disabled domains (one per line) — memory is never captured on these hosts",
        /* @__PURE__ */ u$1(
          "textarea",
          {
            rows: 5,
            value: domainsText,
            placeholder: "bank.example.com\nhealth.example.com",
            onInput: (e2) => setDomainsText(e2.currentTarget.value)
          }
        )
      ] }),
      /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", children: /* @__PURE__ */ u$1("button", { onClick: savePrivacy, className: "bmx-btn bmx-btn--primary", children: "Save privacy" }) })
    ] }),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Appearance" }),
      /* @__PURE__ */ u$1("label", { children: [
        "Theme",
        /* @__PURE__ */ u$1("select", { className: "bmx-select", value: themePref, onChange: (e2) => setTheme(e2.currentTarget.value), children: [
          /* @__PURE__ */ u$1("option", { value: "auto", children: "Match system" }),
          /* @__PURE__ */ u$1("option", { value: "light", children: "Light" }),
          /* @__PURE__ */ u$1("option", { value: "dark", children: "Dark" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1(RelaySection, {}),
    /* @__PURE__ */ u$1(DeveloperSection, {}),
    /* @__PURE__ */ u$1("section", { className: "bmx-section", children: [
      /* @__PURE__ */ u$1("h3", { children: "Diagnostics" }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
        "See ",
        /* @__PURE__ */ u$1("code", { children: "docs/dev/" }),
        " for storage layer details. To export a diagnostic bundle, use ",
        /* @__PURE__ */ u$1("code", { children: "llm-browser logs <session_id>" }),
        " from the MCP server CLI."
      ] })
    ] })
  ] });
}
const en = Object.freeze({
  app: {
    title: "BrowserMemex",
    tagline: "Persistent agent memory + skills + scheduling, in your browser."
  },
  tabs: {
    chat: "Chat",
    tasks: "Tasks",
    memory: "Memory",
    skills: "Skills",
    agents: "Agents",
    registry: "Registry",
    settings: "Settings"
  },
  tasks: {
    newTask: "+ New task",
    empty: "No tasks yet. Use “+ New task” above to schedule one.",
    detail: {
      back: "← Back",
      kind: "Kind",
      status: "Status",
      runs: "Runs",
      created: "Created",
      nextRun: "Next run",
      runHistory: "Run history",
      trackerSamples: "Tracker samples"
    },
    form: {
      title: "Title",
      description: "Description / instruction",
      url: "URL",
      kind: "Kind",
      intervalHours: "Every N hours",
      capability: "Capability",
      includeOpenTabs: "Include my open tabs as context",
      includeOpenTabsHint: "Sends a sanitized list of currently-open tabs (incognito and blocked-host tabs excluded; URL credentials stripped)",
      cancel: "Cancel",
      create: "Create",
      creating: "Creating…"
    }
  },
  memory: {
    title: "Memory",
    searchPlaceholder: "Search facts…",
    viewActive: "Active only",
    viewActivePlusContested: "Include contested",
    search: "Search",
    emptyDefault: "Type a query and press Search.",
    emptyNoMatch: "No matching nuggets.",
    score: "score"
  },
  skills: {
    newSkill: "+ New skill",
    empty: "No skills yet.",
    importHeader: "Import from clipboard",
    importPlaceholder: 'Paste a "browser-memex.skill.v1" envelope here',
    import: "Import",
    export: "Export",
    archive: "Archive",
    unarchive: "Unarchive",
    delete: "Delete",
    deleteConfirm: 'Delete skill "{name}"?'
  },
  agents: {
    title: "Agents",
    refresh: "Refresh",
    hint: "Detection runs via the MCP server. Install BrowserMemex with `llm-browser agents install <id>`.",
    installed: "installed",
    configured: "configured",
    notDetected: "not detected"
  },
  registry: {
    title: "MCP Server Registry",
    hint: "Curated catalog of MCP servers your connected agents can use. Click “Copy config” and paste the snippet into your agent's mcpServers map.",
    filterPlaceholder: "Filter servers…",
    allTags: "All tags",
    copyConfig: "Copy config",
    copied: "Copied ✓",
    showJson: "Show JSON",
    hideJson: "Hide",
    docs: "Docs",
    requires: "⚠ Requires env vars:",
    official: "official"
  },
  settings: {
    title: "Settings",
    routingPolicy: "Routing policy",
    routingPolicyHint: "Edit the Router policy as JSON. Format: { rules, fallback, overrides?, llmFallbackEnabled? }",
    reset: "Reset",
    savePolicy: "Save policy",
    privacy: "Privacy",
    captureMemory: "Capture memory while agents browse",
    disabledDomains: "Disabled domains (one per line) — memory is never captured on these hosts",
    savePrivacy: "Save privacy",
    diagnostics: "Diagnostics",
    diagnosticsHint: "See docs/dev/ for storage layer details. To export a diagnostic bundle, use `llm-browser logs <session_id>` from the MCP server CLI.",
    saved: "Saved. Will apply on next service-worker reload.",
    privacySaved: "Privacy settings saved.",
    appearance: "Appearance",
    theme: "Theme",
    themeAuto: "Match system",
    themeLight: "Light",
    themeDark: "Dark"
  },
  profile: {
    switch: "Switch profile",
    newProfile: "+ New profile",
    manage: "Manage profiles…",
    promptName: "New profile name",
    loading: "Loading profiles…"
  },
  onboarding: {
    welcome: "Welcome to BrowserMemex",
    intro: "BrowserMemex gives your AI coding agents a persistent home in the browser — memory that survives sessions, skills they can reuse, and tasks that run when you're not looking.",
    step1: "Pick the agents you have installed",
    step2: "Tell BrowserMemex which sites it can act on",
    step3: "Optionally turn on memory capture",
    skip: "Skip",
    finish: "Finish setup",
    back: "Back",
    next: "Next"
  },
  popup: {
    quickTask: "Quick task",
    openPanel: "Open side panel",
    placeholder: "What should the agent do?",
    send: "Send"
  },
  common: {
    loading: "Loading…",
    error: "Error",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete"
  }
});
const BUNDLES = { en };
let currentLocale = "en";
function t(key, params) {
  if (typeof key !== "string") return String(key ?? "");
  const tryBundle = (bundleName) => {
    const bundle = BUNDLES[bundleName];
    if (!bundle) return void 0;
    return key.split(".").reduce((cur, part) => cur && typeof cur === "object" ? cur[part] : void 0, bundle);
  };
  const resolved = tryBundle(currentLocale) ?? tryBundle("en") ?? key;
  if (typeof resolved !== "string") return key;
  return interpolate(resolved);
}
function interpolate(template, params) {
  return template;
}
function OnboardingWizard({ onFinish, onSkip }) {
  const rpc = useServicesRpc();
  const [step, setStep] = d(0);
  const [availability, setAvailability] = d(null);
  const [chosenAgents, setChosenAgents] = d(/* @__PURE__ */ new Set());
  const [memoryEnabled, setMemoryEnabled] = d(true);
  const [blockedDomains, setBlockedDomains] = d("");
  const [profileName, setProfileName] = d("");
  const [submitting, setSubmitting] = d(false);
  y(() => {
    rpc.profiles.getActive().then((p2) => {
      setProfileName((p2 == null ? void 0 : p2.name) || "");
    }).catch(() => {
    });
    rpc.agents.availability().then((a2) => {
      setAvailability(a2);
      setChosenAgents(new Set((a2 == null ? void 0 : a2.installed) ?? []));
    }).catch(() => {
      setAvailability({ installed: [], configured: [] });
    });
  }, [rpc]);
  function toggle(id) {
    setChosenAgents((s2) => {
      const next = new Set(s2);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  async function finish() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const profile = await rpc.profiles.getActive();
      const domains = blockedDomains.split("\n").map((d2) => d2.trim()).filter(Boolean);
      const patch = {
        activeAgents: [...chosenAgents],
        privacy: { memoryEnabled, disabledDomains: domains }
      };
      if (profileName.trim() && profileName.trim() !== profile.name) {
        patch.name = profileName.trim();
      }
      await rpc.profiles.update(profile.id, patch);
      onFinish();
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ u$1("div", { className: "bmx-onboarding", role: "dialog", "aria-labelledby": "bmx-onboarding-title", children: /* @__PURE__ */ u$1("div", { className: "bmx-onboarding__card", children: [
    /* @__PURE__ */ u$1("h2", { id: "bmx-onboarding-title", children: t("onboarding.welcome") }),
    /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: t("onboarding.intro") }),
    /* @__PURE__ */ u$1("div", { className: "bmx-onboarding__stepdots", "aria-label": "Setup progress", children: [0, 1, 2].map((i2) => /* @__PURE__ */ u$1(
      "span",
      {
        className: "bmx-onboarding__dot " + (i2 === step ? "bmx-onboarding__dot--active" : ""),
        "aria-current": i2 === step ? "step" : void 0
      },
      i2
    )) }),
    step === 0 && /* @__PURE__ */ u$1("section", { children: [
      /* @__PURE__ */ u$1("h3", { children: t("onboarding.step1") }),
      !availability ? /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: t("common.loading") }) : /* @__PURE__ */ u$1("ul", { className: "bmx-list", children: [
        (availability.installed ?? []).map((id) => /* @__PURE__ */ u$1("li", { className: "bmx-list__item", children: /* @__PURE__ */ u$1("label", { className: "bmx-toggle", children: [
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "checkbox",
              checked: chosenAgents.has(id),
              onChange: () => toggle(id)
            }
          ),
          /* @__PURE__ */ u$1("span", { children: id })
        ] }) }, id)),
        (availability.installed ?? []).length === 0 && /* @__PURE__ */ u$1("li", { className: "bmx-empty", children: [
          "No agents detected yet. You can install BrowserMemex into an agent's MCP config later via",
          " ",
          /* @__PURE__ */ u$1("code", { children: "llm-browser agents install <id>" }),
          "."
        ] })
      ] })
    ] }),
    step === 1 && /* @__PURE__ */ u$1("section", { children: [
      /* @__PURE__ */ u$1("h3", { children: t("onboarding.step2") }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: [
        "List one host per line. Subdomains are included. Example:",
        /* @__PURE__ */ u$1("br", {}),
        /* @__PURE__ */ u$1("code", { children: "bank.com" }),
        " blocks ",
        /* @__PURE__ */ u$1("code", { children: "login.bank.com" }),
        " too."
      ] }),
      /* @__PURE__ */ u$1(
        "textarea",
        {
          rows: 6,
          value: blockedDomains,
          onInput: (e2) => setBlockedDomains(e2.currentTarget.value),
          placeholder: "bank.example.com\nhealth.example.com",
          "aria-label": "Blocked domains"
        }
      )
    ] }),
    step === 2 && /* @__PURE__ */ u$1("section", { children: [
      /* @__PURE__ */ u$1("h3", { children: t("onboarding.step3") }),
      /* @__PURE__ */ u$1("label", { children: [
        'Name this workspace (a "profile" — you can switch between several from the avatar at the bottom-right)',
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            value: profileName,
            onInput: (e2) => setProfileName(e2.currentTarget.value),
            placeholder: "Default"
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { className: "bmx-toggle", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: memoryEnabled,
            onChange: (e2) => setMemoryEnabled(e2.currentTarget.checked)
          }
        ),
        t("settings.captureMemory")
      ] }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", children: "All memory stays on your device. The disabled-domain list from the previous step always overrides this." }),
      /* @__PURE__ */ u$1("p", { className: "bmx-hint", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ u$1("strong", { children: "Connect a coding agent" }),
        ` once you're done — open the Agents tab and click "Connect" next to Claude Code / Cursor / Codex / Gemini CLI / whatever you use. Your memex follows you across all of them.`
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "bmx-form__actions", children: [
      /* @__PURE__ */ u$1("button", { type: "button", onClick: onSkip, className: "bmx-btn", children: t("onboarding.skip") }),
      step > 0 && /* @__PURE__ */ u$1("button", { type: "button", onClick: () => setStep((s2) => s2 - 1), className: "bmx-btn", children: t("onboarding.back") }),
      step < 2 ? /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          onClick: () => setStep((s2) => s2 + 1),
          className: "bmx-btn bmx-btn--primary",
          children: t("onboarding.next")
        }
      ) : /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          onClick: finish,
          className: "bmx-btn bmx-btn--primary",
          disabled: submitting,
          children: submitting ? t("common.loading") : t("onboarding.finish")
        }
      )
    ] })
  ] }) });
}
const ACTIVE_TAB_STORAGE_KEY = "browser-memex.activeTab";
function loadActiveTab() {
  try {
    return localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || "chat";
  } catch {
    return "chat";
  }
}
function saveActiveTab(id) {
  try {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, id);
  } catch {
  }
}
const ONBOARDED_KEY = "browser-memex.onboardedAt";
function loadOnboarded() {
  try {
    return Boolean(localStorage.getItem(ONBOARDED_KEY));
  } catch {
    return false;
  }
}
function App() {
  useTheme();
  const [activeTab, setActiveTab] = d(loadActiveTab);
  const [suggestedText, setSuggestedText] = d("");
  const [skillDraft, setSkillDraft] = d(null);
  const [onboarded, setOnboarded] = d(loadOnboarded);
  const config = useConfig();
  const chat = useChat();
  const history = useChatHistory();
  y(() => {
    const onMessage = (msg) => {
      if (!msg || typeof msg.type !== "string") return;
      if (msg.type === "SET_PREFILL" && typeof msg.text === "string") {
        setActiveTab("chat");
        setSuggestedText(msg.text);
      } else if (msg.type === "SKILL_DRAFT" && msg.draft) {
        setActiveTab("skills");
        setSkillDraft(msg.draft);
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, []);
  y(() => {
    var _a;
    const TEN_MIN = 10 * 60 * 1e3;
    const now = Date.now();
    (_a = chrome.storage) == null ? void 0 : _a.local.get(["bmx.pending-prefill", "bmx.pending-skill-draft"]).then((res) => {
      const pf = res == null ? void 0 : res["bmx.pending-prefill"];
      if ((pf == null ? void 0 : pf.text) && now - (pf.ts ?? 0) < TEN_MIN) {
        setActiveTab("chat");
        setSuggestedText(pf.text);
        chrome.storage.local.remove("bmx.pending-prefill").catch(() => {
        });
      }
      const sd = res == null ? void 0 : res["bmx.pending-skill-draft"];
      if ((sd == null ? void 0 : sd.draft) && now - (sd.ts ?? 0) < TEN_MIN) {
        setActiveTab("skills");
        setSkillDraft(sd.draft);
        chrome.storage.local.remove("bmx.pending-skill-draft").catch(() => {
        });
      }
    }).catch(() => {
    });
  }, []);
  const finishOnboarding = q(() => {
    try {
      localStorage.setItem(ONBOARDED_KEY, String(Date.now()));
    } catch {
    }
    setOnboarded(true);
    setActiveTab("tasks");
  }, []);
  y(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);
  const handleNewChat = q(() => {
    history.newSession(chat.messages);
    chat.clearChat();
  }, [chat.messages, chat.clearChat, history.newSession]);
  const handleSelectSession = q((sessionId) => {
    if (chat.messages.length > 0) {
      history.saveSession(chat.messages);
    }
    const messages = history.restoreSession(sessionId);
    if (messages) chat.restoreMessages(messages);
  }, [chat.messages, history.saveSession, history.restoreSession, chat.restoreMessages]);
  if (config.isLoading) {
    return /* @__PURE__ */ u$1("div", { class: "loading-container", children: /* @__PURE__ */ u$1("div", { class: "loading-spinner" }) });
  }
  if (!onboarded) {
    return /* @__PURE__ */ u$1("div", { class: "app", children: /* @__PURE__ */ u$1(OnboardingWizard, { onFinish: finishOnboarding, onSkip: finishOnboarding }) });
  }
  return /* @__PURE__ */ u$1("div", { class: "app", children: [
    /* @__PURE__ */ u$1("div", { class: "bmx-shell", children: [
      /* @__PURE__ */ u$1("div", { class: "bmx-main", children: /* @__PURE__ */ u$1("div", { class: "bmx-tab-container", children: [
        activeTab === "chat" && /* @__PURE__ */ u$1(
          ChatPanel,
          {
            chat,
            config,
            history,
            handleNewChat,
            handleSelectSession,
            suggestedText,
            setSuggestedText
          }
        ),
        activeTab === "tasks" && /* @__PURE__ */ u$1(TasksTab, {}),
        activeTab === "memory" && /* @__PURE__ */ u$1(MemoryTab, {}),
        activeTab === "skills" && /* @__PURE__ */ u$1(
          SkillsTab,
          {
            initialDraft: skillDraft,
            onDraftConsumed: () => setSkillDraft(null)
          }
        ),
        activeTab === "agents" && /* @__PURE__ */ u$1(AgentsTab, {}),
        activeTab === "registry" && /* @__PURE__ */ u$1(RegistryTab, {}),
        activeTab === "settings" && /* @__PURE__ */ u$1(SettingsTab, {})
      ] }) }),
      /* @__PURE__ */ u$1(
        TabBar,
        {
          active: activeTab,
          onSelect: setActiveTab,
          extraTabs: [{ id: "chat", label: "Chat" }],
          onManageProfiles: () => setActiveTab("settings")
        }
      )
    ] }),
    chat.pendingPlan && /* @__PURE__ */ u$1(
      PlanModal,
      {
        plan: chat.pendingPlan,
        onApprove: chat.approvePlan,
        onCancel: chat.cancelPlan
      }
    ),
    /* @__PURE__ */ u$1(DialogHost, {}),
    /* @__PURE__ */ u$1(ToastHost, {})
  ] });
}
function ChatPanel({
  chat,
  config,
  history,
  handleNewChat,
  handleSelectSession,
  suggestedText,
  setSuggestedText
}) {
  const hasMessages = chat.messages.length > 0;
  return /* @__PURE__ */ u$1(S, { children: [
    /* @__PURE__ */ u$1(
      Header,
      {
        currentModel: config.currentModel,
        availableModels: config.availableModels,
        currentModelIndex: config.currentModelIndex,
        onModelSelect: config.selectModel,
        onNewChat: handleNewChat,
        sessions: history.sessions,
        activeSessionId: history.activeSessionId,
        onSelectSession: handleSelectSession,
        onDeleteSession: history.deleteSession
      }
    ),
    /* @__PURE__ */ u$1("div", { class: "messages-container", children: [
      !hasMessages ? /* @__PURE__ */ u$1(EmptyState, { onSelectExample: setSuggestedText }) : /* @__PURE__ */ u$1(
        MessageList,
        {
          messages: chat.messages,
          pendingStep: chat.pendingStep,
          currentSteps: chat.currentSteps
        }
      ),
      chat.lastTrajectory && /* @__PURE__ */ u$1(
        SaveAsSkillBanner,
        {
          trajectory: chat.lastTrajectory,
          onDismiss: chat.dismissLastTrajectory
        }
      )
    ] }),
    /* @__PURE__ */ u$1(
      InputArea,
      {
        isRunning: chat.isRunning,
        attachedImages: chat.attachedImages,
        onSend: chat.sendMessage,
        onStop: chat.stopTask,
        onAddImage: chat.addImage,
        onRemoveImage: chat.removeImage,
        hasModels: config.availableModels.length > 0,
        suggestedText,
        onClearSuggestion: () => setSuggestedText("")
      }
    )
  ] });
}
R(/* @__PURE__ */ u$1(App, {}), document.getElementById("app"));
//# sourceMappingURL=sidepanel.js.map
