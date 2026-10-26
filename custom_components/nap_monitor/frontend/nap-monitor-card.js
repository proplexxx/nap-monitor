const Z = globalThis, it = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, xt = /* @__PURE__ */ Symbol(), lt = /* @__PURE__ */ new WeakMap();
let Ot = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== xt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (it && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = lt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && lt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (n) => new Ot(typeof n == "string" ? n : n + "", void 0, xt), Dt = (n, t) => {
  if (it) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = Z.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, ct = it ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Rt(e);
})(n) : n;
const { is: It, defineProperty: Ut, getOwnPropertyDescriptor: qt, getOwnPropertyNames: Ft, getOwnPropertySymbols: Zt, getPrototypeOf: jt } = Object, W = globalThis, dt = W.trustedTypes, Bt = dt ? dt.emptyScript : "", Wt = W.reactiveElementPolyfillSupport, z = (n, t) => n, tt = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Bt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, wt = (n, t) => !It(n, t), ht = { attribute: !0, type: String, converter: tt, reflect: !1, useDefault: !1, hasChanged: wt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ht) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Ut(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = qt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const l = s?.call(this);
      r?.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, i = [...Ft(e), ...Zt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(ct(s));
    } else t !== void 0 && e.push(ct(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Dt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : tt).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = i.getPropertyOptions(s), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : tt;
      this._$Em = s;
      const l = o.fromAttribute(e, r.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (r = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? wt)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, r] of i) {
        const { wrapped: o } = r, l = this[s];
        o !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[z("elementProperties")] = /* @__PURE__ */ new Map(), M[z("finalized")] = /* @__PURE__ */ new Map(), Wt?.({ ReactiveElement: M }), (W.reactiveElementVersions ??= []).push("2.1.2");
const st = globalThis, pt = (n) => n, j = st.trustedTypes, ut = j ? j.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, At = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, Ht = "?" + x, Gt = `<${Ht}>`, L = document, N = () => L.createComment(""), O = (n) => n === null || typeof n != "object" && typeof n != "function", nt = Array.isArray, Yt = (n) => nt(n) || typeof n?.[Symbol.iterator] == "function", K = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ft = /-->/g, mt = />/g, C = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, vt = /"/g, Ct = /^(?:script|style|textarea|title)$/i, kt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), p = kt(1), J = kt(2), H = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), k = L.createTreeWalker(L, 129);
function Lt(n, t) {
  if (!nt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const Kt = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let h, c, d = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, c = o.exec(a), c !== null); ) m = o.lastIndex, o === E ? c[1] === "!--" ? o = ft : c[1] !== void 0 ? o = mt : c[2] !== void 0 ? (Ct.test(c[2]) && (s = RegExp("</" + c[2], "g")), o = C) : c[3] !== void 0 && (o = C) : o === C ? c[0] === ">" ? (o = s ?? E, d = -1) : c[1] === void 0 ? d = -2 : (d = o.lastIndex - c[2].length, h = c[1], o = c[3] === void 0 ? C : c[3] === '"' ? vt : gt) : o === vt || o === gt ? o = C : o === ft || o === mt ? o = E : (o = C, s = void 0);
    const v = o === C && n[l + 1].startsWith("/>") ? " " : "";
    r += o === E ? a + Gt : d >= 0 ? (i.push(h), a.slice(0, d) + At + a.slice(d) + x + v) : a + x + (d === -2 ? l : v);
  }
  return [Lt(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class R {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [h, c] = Kt(t, e);
    if (this.el = R.createElement(h, i), k.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = k.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(At)) {
          const m = c[o++], v = s.getAttribute(d).split(x), _ = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: r, name: _[2], strings: v, ctor: _[1] === "." ? Xt : _[1] === "?" ? Qt : _[1] === "@" ? te : G }), s.removeAttribute(d);
        } else d.startsWith(x) && (a.push({ type: 6, index: r }), s.removeAttribute(d));
        if (Ct.test(s.tagName)) {
          const d = s.textContent.split(x), m = d.length - 1;
          if (m > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let v = 0; v < m; v++) s.append(d[v], N()), k.nextNode(), a.push({ type: 2, index: ++r });
            s.append(d[m], N());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ht) a.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(x, d + 1)) !== -1; ) a.push({ type: 7, index: r }), d += x.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = L.createElement("template");
    return i.innerHTML = t, i;
  }
}
function V(n, t, e = n, i) {
  if (t === H) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = O(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = V(n, s._$AS(n, t.values), s, i)), t;
}
class Jt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? L).importNode(e, !0);
    k.currentNode = s;
    let r = k.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new I(r, r.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (h = new ee(r, this, t)), this._$AV.push(h), a = i[++l];
      }
      o !== a?.index && (r = k.nextNode(), o++);
    }
    return k.currentNode = L, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class I {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = V(this, t, e), O(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== H && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Yt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(L.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = R.createElement(Lt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const r = new Jt(s, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = _t.get(t.strings);
    return e === void 0 && _t.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new I(this.O(N()), this.O(N()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = pt(t).nextSibling;
      pt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = V(this, t, e, 0), o = !O(t) || t !== this._$AH && t !== H, o && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = r[0], a = 0; a < r.length - 1; a++) h = V(this, l[i + a], e, a), h === H && (h = this._$AH[a]), o ||= !O(h) || h !== this._$AH[a], h === u ? t = u : t !== u && (t += (h ?? "") + r[a + 1]), this._$AH[a] = h;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
let Xt = class extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
};
class Qt extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class te extends G {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = V(this, t, e, 0) ?? u) === H) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ee {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    V(this, t);
  }
}
const ie = st.litHtmlPolyfillSupport;
ie?.(R, I), (st.litHtmlVersions ??= []).push("3.3.3");
const St = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = s = new I(t.insertBefore(N(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
const rt = globalThis;
let P = class extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = St(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return H;
  }
};
P._$litElement$ = !0, P.finalized = !0, rt.litElementHydrateSupport?.({ LitElement: P });
const se = rt.litElementPolyfillSupport;
se?.({ LitElement: P });
(rt.litElementVersions ??= []).push("4.2.2");
const Mt = { ATTRIBUTE: 1 }, ot = (n) => (...t) => ({ _$litDirective$: n, values: t });
let at = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
const y = ot(class extends at {
  constructor(n) {
    if (super(n), n.type !== Mt.ATTRIBUTE || n.name !== "class" || n.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(n) {
    return " " + Object.keys(n).filter((t) => n[t]).join(" ") + " ";
  }
  update(n, [t]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), n.strings !== void 0 && (this.nt = new Set(n.strings.join(" ").split(/\s/).filter((i) => i !== "")));
      for (const i in t) t[i] && !this.nt?.has(i) && this.st.add(i);
      return this.render(t);
    }
    const e = n.element.classList;
    for (const i of this.st) i in t || (e.remove(i), this.st.delete(i));
    for (const i in t) {
      const s = !!t[i];
      s === this.st.has(i) || this.nt?.has(i) || (s ? (e.add(i), this.st.add(i)) : (e.remove(i), this.st.delete(i)));
    }
    return H;
  }
});
const ne = {}, re = (n, t = ne) => n._$AH = t;
const oe = ot(class extends at {
  constructor() {
    super(...arguments), this.key = u;
  }
  render(n, t) {
    return this.key = n, t;
  }
  update(n, [t, e]) {
    return t !== this.key && (re(n), this.key = t), e;
  }
});
const Vt = "important", ae = " !" + Vt, le = ot(class extends at {
  constructor(n) {
    if (super(n), n.type !== Mt.ATTRIBUTE || n.name !== "style" || n.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(n) {
    return Object.keys(n).reduce((t, e) => {
      const i = n[e];
      return i == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(n, [t]) {
    const { style: e } = n.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft) t[i] == null && (this.ft.delete(i), i.includes("-") ? e.removeProperty(i) : e[i] = null);
    for (const i in t) {
      const s = t[i];
      if (s != null) {
        this.ft.add(i);
        const r = typeof s == "string" && s.endsWith(ae);
        i.includes("-") || r ? e.setProperty(i, r ? s.slice(0, -11) : s, r ? Vt : "") : e[i] = s;
      }
    }
    return H;
  }
});
async function ce(n, t, e) {
  if (!t.length) return [];
  const i = new Date(Date.now() - e * 36e5).toISOString(), s = await n.callWS({ type: "logbook/get_events", start_time: i, entity_ids: t }), r = {}, o = [];
  for (const l of s) {
    const a = Number(l.when) * 1e3;
    l.state === "on" ? r[l.entity_id] = a : l.state === "off" && r[l.entity_id] && (o.push({ start: r[l.entity_id], end: a, entityId: l.entity_id }), delete r[l.entity_id]);
  }
  for (const l of Object.keys(r)) o.push({ start: r[l], end: null, entityId: l });
  for (const l of t) {
    const a = n.states[l];
    a && a.state === "on" && !o.some((h) => h.entityId === l && h.end === null) && o.push({ start: new Date(a.last_changed).getTime(), end: null, entityId: l });
  }
  return o.sort((l, a) => a.start - l.start);
}
var de = "M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z", he = "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z", pe = "M14.5,9.25A1.25,1.25 0 0,1 15.75,10.5A1.25,1.25 0 0,1 14.5,11.75A1.25,1.25 0 0,1 13.25,10.5A1.25,1.25 0 0,1 14.5,9.25M9.5,9.25A1.25,1.25 0 0,1 10.75,10.5A1.25,1.25 0 0,1 9.5,11.75A1.25,1.25 0 0,1 8.25,10.5A1.25,1.25 0 0,1 9.5,9.25M7.5,14H16.5C15.74,15.77 14,17 12,17C10,17 8.26,15.77 7.5,14M1,12C1,10.19 2.2,8.66 3.86,8.17C5.29,5.11 8.4,3 12,3C15.6,3 18.71,5.11 20.15,8.17C21.8,8.66 23,10.19 23,12C23,13.81 21.8,15.34 20.15,15.83C18.71,18.89 15.6,21 12,21C8.4,21 5.29,18.89 3.86,15.83C2.2,15.34 1,13.81 1,12M12,5C8.82,5 6.14,7.12 5.28,10H5A2,2 0 0,0 3,12A2,2 0 0,0 5,14H5.28C6.14,16.88 8.82,19 12,19C15.18,19 17.86,16.88 18.72,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H18.72C17.86,7.12 15.18,5 12,5Z", ue = "M1.2,4.47L2.5,3.2L20,20.72L18.73,22L16.73,20H4A2,2 0 0,1 2,18V6C2,5.78 2.04,5.57 2.1,5.37L1.2,4.47M7,4L9,2H15L17,4H20A2,2 0 0,1 22,6V18C22,18.6 21.74,19.13 21.32,19.5L16.33,14.5C16.76,13.77 17,12.91 17,12A5,5 0 0,0 12,7C11.09,7 10.23,7.24 9.5,7.67L5.82,4H7M7,12A5,5 0 0,0 12,17C12.5,17 13.03,16.92 13.5,16.77L11.72,15C10.29,14.85 9.15,13.71 9,12.28L7.23,10.5C7.08,10.97 7,11.5 7,12M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9Z", fe = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z", me = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", ge = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", ve = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", _e = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z", be = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", ye = "M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z", $e = "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z", xe = "M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z", we = "M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M18 8H6V16H18V8Z", Ae = "M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z", He = "M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z", Ce = "M5,7H7V11H9V7H11V17H9V13H7V17H5V7M13,7H16A3,3 0 0,1 19,10V14A3,3 0 0,1 16,17H13V7M16,15A1,1 0 0,0 17,14V10A1,1 0 0,0 16,9H15V15H16Z", ke = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", Le = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Se = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Me = "M19,11H11V17H19V11M23,19V5C23,3.88 22.1,3 21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19M21,19H3V4.97H21V19Z", Ve = "M8,5.14V19.14L19,12.14L8,5.14Z", Ee = "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z", Te = "M23,12H17V10L20.39,6H17V4H23V6L19.62,10H23V12M15,16H9V14L12.39,10H9V8H15V10L11.62,14H15V16M7,20H1V18L4.39,14H1V12H7V14L3.62,18H7V20Z", ze = "M18,18H6V6H18V18Z", Pe = "M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z", Ne = "M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z", Oe = "M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z", Re = "M3.27,2L2,3.27L4.73,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16C16.2,18 16.39,17.92 16.54,17.82L19.73,21L21,19.73M21,6.5L17,10.5V7A1,1 0 0,0 16,6H9.82L21,17.18V6.5Z", De = "M21 3H3C2.4 3 2 3.4 2 4V10C2 10.6 2.4 11 3 11H21C21.6 11 22 10.6 22 10V4C22 3.4 21.6 3 21 3M21 13H3C2.4 13 2 13.4 2 14V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20V14C22 13.4 21.6 13 21 13Z", Ie = "M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3", Ue = "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z", qe = "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z", Fe = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", Ze = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13";
const f = {
  kids: de,
  cry: pe,
  cameraOff: ue,
  check: fe,
  down: me,
  left: ge,
  right: ve,
  up: _e,
  close: be,
  save: ye,
  calibrate: $e,
  move: xe,
  fill: we,
  fullscreen: Ae,
  fullscreenExit: He,
  hd: Ce,
  history: ke,
  home: Le,
  motion: Se,
  pip: Me,
  play: Ve,
  privacy: Ee,
  sleep: Te,
  stop: ze,
  tv: Pe,
  nightAuto: Ne,
  tune: Oe,
  offline: Re,
  focus: De,
  grid: Ie,
  sound: Ue,
  muted: qe,
  night: Fe,
  day: Ze,
  alert: he
}, g = (n, t = 22) => p`<svg viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true"><path fill="currentColor" d=${n}></path></svg>`, je = {
  layout: "grid",
  night_mode: "auto",
  night_start: "19:30",
  night_end: "07:00",
  events_hours: 24,
  timeline_hours: 12,
  stream_suffix: "_fluent",
  hd_suffix: "_clear",
  native_player: !1,
  tv_scripts: [],
  follow_cry: !0,
  exclusive_audio: !0,
  show_timeline: !0,
  show_sensors: !0,
  fit: "cover"
};
function Be(n) {
  if (!n || typeof n != "object") throw new Error("Nap Monitor: configuration is missing");
  const t = (Array.isArray(n.children) ? n.children : []).map((i, s) => {
    if (!i || !i.name) throw new Error(`Nap Monitor: child ${s + 1} needs a name`);
    const r = Array.isArray(i.locations) ? i.locations : i.cameras;
    if (!Array.isArray(r) || !r.length) throw new Error(`Nap Monitor: ${i.name} needs at least one camera`);
    const o = r.map((l, a) => {
      if (!l || !l.key) throw new Error(`Nap Monitor: ${i.name} camera ${a + 1} needs a key`);
      return { ...l, sensors: Array.isArray(l.sensors) ? l.sensors : [] };
    });
    return { name: String(i.name), color: i.color, cameras: o };
  });
  if (!t.length) throw new Error("Nap Monitor: add a children list, each with a name and cameras");
  const e = { ...je, ...n, children: t };
  return ["grid", "focus", "fill"].includes(e.layout) || (e.layout = "grid"), ["auto", "on", "off"].includes(e.night_mode) || (e.night_mode = "auto"), e.events_hours = Number(e.events_hours) || 24, e.timeline_hours = Number(e.timeline_hours) || 12, e.tv_scripts = Array.isArray(e.tv_scripts) ? e.tv_scripts : [], e.fit !== "contain" && (e.fit = "cover"), e;
}
function A(n, t) {
  const e = t.key;
  return {
    camera: t.camera || `camera.${e}${n.stream_suffix}`,
    cameraHd: t.camera_hd || `camera.${e}${n.hd_suffix}`,
    cry: t.cry || `binary_sensor.${e}_baby_crying`,
    motion: t.motion || `binary_sensor.${e}_motion`,
    privacy: t.privacy || `switch.${e}_privacy_mode`,
    ptz: {
      up: `button.${e}_ptz_up`,
      down: `button.${e}_ptz_down`,
      left: `button.${e}_ptz_left`,
      right: `button.${e}_ptz_right`,
      stop: `button.${e}_ptz_stop`,
      preset: `select.${e}_ptz_preset`,
      guardSet: `button.${e}_guard_set_current_position`,
      guardGo: `button.${e}_guard_go_to`,
      calibrate: `button.${e}_ptz_calibrate`,
      autoTrack: `switch.${e}_auto_tracking`
    }
  };
}
function We(n) {
  const t = n;
  return [
    { section: "Listening", id: `number.${t}_baby_cry_sensitivity`, label: "Cry sensitivity", hint: "Higher catches softer cries, and more false alarms" },
    { section: "Listening", id: `number.${t}_volume`, label: "Camera speaker volume" },
    { section: "Listening", id: `switch.${t}_record_audio`, label: "Record audio" },
    { section: "Night", id: `select.${t}_day_night_mode`, label: "Night vision" },
    { section: "Night", id: `switch.${t}_infrared_lights_in_night_mode`, label: "Infrared lights at night" },
    { section: "Night", id: `light.${t}_status_led`, label: "Status light on camera" },
    { section: "Detection", id: `number.${t}_motion_sensitivity`, label: "Motion sensitivity" },
    { section: "Detection", id: `number.${t}_ai_person_sensitivity`, label: "Person sensitivity" },
    { section: "Detection", id: `switch.${t}_auto_tracking`, label: "Follow movement", hint: "Camera turns to keep motion in view" },
    { section: "Detection", id: `switch.${t}_guard_return`, label: "Return to home position" },
    { section: "Detection", id: `number.${t}_guard_return_time`, label: "Return after (seconds)" },
    { section: "Recording and alerts", id: `switch.${t}_record`, label: "Record to memory card" },
    { section: "Recording and alerts", id: `switch.${t}_push_notifications`, label: "Reolink app notifications" },
    { section: "Recording and alerts", id: `switch.${t}_siren_on_event`, label: "Siren on detection", hint: "Keep this off in a nursery" },
    { section: "Privacy", id: `switch.${t}_privacy_mode`, label: "Privacy mode", hint: "Stops the video and turns the lens away" }
  ];
}
function $(n) {
  return n.label || n.key.replace(/_/g, " ");
}
const q = (n) => new Date(n).getTime();
function Ge(n, t, e, i) {
  const s = A(t, e), r = i && n?.states[s.cameraHd] ? s.cameraHd : s.camera, o = (m) => n?.states[m], l = o(r);
  if (!l) return { kind: "missing", since: null, cameraId: r };
  const a = o(s.privacy);
  if (a && a.state === "on") return { kind: "privacy", since: q(a.last_changed), cameraId: r };
  if (l.state === "unavailable") return { kind: "offline", since: q(l.last_changed), cameraId: r };
  const h = o(s.cry);
  if (h && h.state === "on") return { kind: "crying", since: q(h.last_changed), cameraId: r };
  const c = o(s.motion), d = h ? q(h.last_changed) : null;
  return c && c.state === "on" ? { kind: "stirring", since: d, cameraId: r } : h ? { kind: "quiet", since: d, cameraId: r } : { kind: "live", since: null, cameraId: r };
}
function S(n, t, e) {
  const i = n?.states[A(t, e).cry];
  return !!i && i.state === "on";
}
function Ye(n, t) {
  const e = n.states[t];
  if (!e || e.state === "unavailable" || e.state === "unknown") return null;
  const i = String(e.attributes.friendly_name || t).split(" ").slice(-1)[0], s = e.attributes.unit_of_measurement;
  if (s) {
    const o = Number(e.state);
    return `${Number.isFinite(o) ? Math.abs(o) >= 10 ? Math.round(o) : Math.round(o * 10) / 10 : e.state}${s.length <= 2 ? s : " " + s}`;
  }
  const r = t.split(".")[0];
  if (["switch", "fan", "light", "media_player", "binary_sensor", "input_boolean"].includes(r)) {
    const o = ["on", "playing"].includes(e.state);
    return `${i} ${o ? "on" : "off"}`;
  }
  return n.formatEntityState ? n.formatEntityState(e) : e.state;
}
const Et = `
  --nm-bg: var(--card-background-color, #1c1f26);
  --nm-fg: var(--primary-text-color, #f3f4f6);
  --nm-fg2: var(--secondary-text-color, #9aa3b2);
  --nm-line: var(--divider-color, rgba(127,127,127,.28));
  --nm-chip: rgba(127,127,127,.14);
  --nm-accent: var(--primary-color, #7aa2f7);
  --nm-cry: var(--error-color, #ef5350);
  --nm-stir: var(--warning-color, #ffb300);
  --nm-quiet: var(--success-color, #43a047);
  --nm-muted: #8b8fa3;
  --nm-radius: var(--ha-card-border-radius, 16px);
  --nm-font: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, system-ui, -apple-system, sans-serif));
  --nm-video-filter: none;
  --nm-gap: 12px;
  --nm-ink: #fff;
`, Tt = `
  --nm-bg: #09070b;
  --nm-fg: #e6b78f;
  --nm-fg2: #9b7556;
  --nm-line: rgba(230,183,143,.18);
  --nm-chip: rgba(230,183,143,.08);
  --nm-accent: #e6b78f;
  --nm-quiet: #a86f3a;
  --nm-stir: #d9922e;
  --nm-cry: #d8453a;
  --nm-ink: #f3d7bd;
  --nm-video-filter: brightness(.55) sepia(.75) saturate(1.5) hue-rotate(-22deg);
`, Ke = `
:host { display: block; height: 100%; }
* { box-sizing: border-box; }
button { font: inherit; }
.root {
  ${Et}
  font-family: var(--nm-font);
  color: var(--nm-fg);
  display: flex; flex-direction: column; gap: var(--nm-gap);
  height: 100%; min-height: 0; padding: 8px;
  -webkit-tap-highlight-color: transparent;
}
.root.night { ${Tt} background: var(--nm-bg); border-radius: var(--nm-radius); }
.root:fullscreen { background: #000; padding: 12px; }

/* header */
.hdr { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 44px; }
.hdr .title { font-size: 20px; font-weight: 700; letter-spacing: -.01em; margin-right: 4px; }
.seg { display: inline-flex; background: var(--nm-chip); border-radius: 999px; padding: 3px; gap: 2px; }
.seg button { position: relative; border: 0; background: transparent; color: var(--nm-fg2); padding: 8px 14px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; line-height: 1; display: inline-flex; align-items: center; gap: 6px; }
.seg button.on { background: var(--nm-bg); color: var(--nm-fg); box-shadow: 0 1px 3px rgba(0,0,0,.35); }
.seg button .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nm-cry); box-shadow: 0 0 0 0 var(--nm-cry); animation: ping 1.6s infinite; }
.tools { margin-left: auto; display: flex; gap: 6px; align-items: center; }
.ib { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 40px; min-width: 40px; padding: 0 10px; border-radius: 12px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap; }
.ib.on { background: var(--nm-fg); color: var(--nm-bg); border-color: transparent; }
.ib .lbl { display: inline; }
.ib:focus-visible, .seg button:focus-visible, .loc:focus-visible, .btn:focus-visible { outline: 2px solid var(--nm-accent); outline-offset: 2px; }
.chip { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--nm-line); background: transparent; color: var(--nm-fg); cursor: pointer; font-size: 14px; }

/* tiles */
.grid { display: grid; gap: var(--nm-gap); flex: 1; min-height: 0; align-content: start; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); }
.grid[data-n='1'] { grid-template-columns: 1fr; }
.tile { display: flex; flex-direction: column; min-width: 0; border-radius: var(--nm-radius); overflow: hidden; background: var(--nm-bg); border: 1px solid var(--nm-line); transition: box-shadow .3s, border-color .3s; }
.tile.crying { border-color: var(--nm-cry); box-shadow: 0 0 0 2px var(--nm-cry), 0 0 28px rgba(239,83,80,.35); animation: breathe 1.6s ease-in-out infinite; }
@keyframes breathe { 50% { box-shadow: 0 0 0 2px var(--nm-cry), 0 0 8px rgba(239,83,80,.15); } }
@keyframes ping { 70% { box-shadow: 0 0 0 6px rgba(239,83,80,0); } 100% { box-shadow: 0 0 0 0 rgba(239,83,80,0); } }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) { .tile.crying, .seg button .dot, .video.connecting::after { animation: none !important; } }

.video { position: relative; aspect-ratio: 16 / 9; background: #000; overflow: hidden; --video-max-height: none; }
.video ha-camera-stream { display: block; width: 100%; height: 100%; filter: var(--nm-video-filter); transition: filter .4s; }
/* Stretched tiles (Focus main, Fill): the video box takes the tile's height and the
   stream is sized by a ResizeObserver to cover or fit it, avoiding CSS sizing cycles. */
.video.stretch:not(:fullscreen) { aspect-ratio: auto; flex: 1 1 auto; min-height: 0; }
.video.stretch:not(:fullscreen) ha-camera-stream { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: var(--nm-stream-w, 100%); height: auto; }
.video.connecting::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent); animation: shimmer 1.6s infinite; pointer-events: none; }
.video:fullscreen, .video:-webkit-full-screen { aspect-ratio: auto; width: 100vw; height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; }
.video:fullscreen ha-camera-stream, .video:-webkit-full-screen ha-camera-stream { width: min(100vw, 177.78vh); height: auto; max-height: 100vh; }
.scrim { position: absolute; left: 0; right: 0; height: 40%; pointer-events: none; z-index: 1; }
.scrim.top { top: 0; background: linear-gradient(rgba(0,0,0,.55), transparent); }
.scrim.bottom { bottom: 0; background: linear-gradient(transparent, rgba(0,0,0,.7)); }
.nostream { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #9aa3b2; text-align: center; padding: 16px; font-size: 14px; }
.nostream b { color: #cfd3dc; font-size: 15px; }

.ov-top { position: absolute; top: 10px; left: 12px; right: 10px; display: flex; align-items: center; gap: 8px; z-index: 2; }
.who { display: flex; align-items: center; gap: 8px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.6); font-weight: 700; font-size: 16px; min-width: 0; }
.who .avatar { width: 10px; height: 10px; border-radius: 50%; background: var(--accent, var(--nm-accent)); flex: none; box-shadow: 0 0 0 2px rgba(0,0,0,.35); }
.who .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.who .where { font-weight: 500; font-size: 12px; padding: 3px 9px; border-radius: 999px; background: rgba(0,0,0,.4); backdrop-filter: blur(6px); white-space: nowrap; }
.quick { margin-left: auto; display: flex; gap: 6px; }
.quick .ib { width: 36px; height: 36px; min-width: 36px; padding: 0; border: 0; background: rgba(0,0,0,.45); color: #fff; backdrop-filter: blur(6px); }
.quick .ib.on { background: #fff; color: #111; }

.ov-bottom { position: absolute; left: 12px; right: 12px; bottom: 16px; display: flex; align-items: flex-end; gap: 8px; z-index: 2; }
.status { display: inline-flex; align-items: center; gap: 10px; padding: 7px 14px 7px 8px; border-radius: 999px; background: rgba(0,0,0,.55); backdrop-filter: blur(8px); color: #fff; font-size: 15px; font-weight: 600; line-height: 1.1; max-width: 100%; }
.status .ic { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: var(--nm-muted); flex: none; }
.status .txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.status .sub { font-weight: 500; font-size: 12px; opacity: .8; white-space: nowrap; }
.status.quiet .ic { background: var(--nm-quiet); }
.status.live .ic { background: var(--nm-quiet); }
.status.stirring .ic { background: var(--nm-stir); color: #222; }
.status.crying { background: var(--nm-cry); }
.status.crying .ic { background: rgba(255,255,255,.25); }
.status.privacy .ic, .status.offline .ic, .status.missing .ic { background: var(--nm-muted); }
.readouts { margin-left: auto; display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.readout { padding: 4px 9px; border-radius: 999px; background: rgba(0,0,0,.45); backdrop-filter: blur(6px); color: #fff; font-size: 12px; font-weight: 500; white-space: nowrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; font-size: 14px; font-weight: 600; }
.btn.resume { background: #fff; color: #111; border-color: transparent; }

.tl { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; z-index: 2; display: block; }
.tl rect.track { fill: rgba(255,255,255,.14); }
.tl rect.ep { fill: var(--nm-cry); }
.tl line { stroke: rgba(255,255,255,.18); stroke-width: 1; }

/* under the video */
.foot { display: flex; align-items: center; gap: 8px; padding: 8px 10px; flex-wrap: wrap; }
.locs { display: flex; gap: 4px; flex-wrap: wrap; }
.loc { position: relative; border: 1px solid var(--nm-line); background: transparent; color: var(--nm-fg2); border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; line-height: 1; }
.loc.on { background: var(--nm-fg); color: var(--nm-bg); border-color: transparent; font-weight: 600; }
.loc .dot { position: absolute; top: -3px; right: -3px; width: 9px; height: 9px; border-radius: 50%; background: var(--nm-cry); box-shadow: 0 0 0 2px var(--nm-bg); }
.acts { margin-left: auto; display: flex; gap: 4px; }
.acts .ib { height: 36px; min-width: 36px; padding: 0 8px; border-radius: 10px; background: transparent; color: var(--nm-fg2); }
.acts .ib.on { background: var(--nm-fg); color: var(--nm-bg); border-color: transparent; }
.acts .ib.txt { font-weight: 700; font-size: 12px; letter-spacing: .02em; }

/* focus layout: one big tile, the rest stacked beside it */
.root[data-layout='focus'] .grid { grid-template-columns: minmax(0, 1fr) minmax(200px, 26%); grid-template-rows: minmax(0, 1fr); align-content: stretch; }
.root[data-layout='focus'] .grid[data-n='1'] { grid-template-columns: 1fr; }
.root[data-layout='focus'] .tile.main { grid-column: 1; grid-row: 1; min-height: 0; }
.root[data-layout='focus'] .insets { grid-column: 2; grid-row: 1; display: flex; flex-direction: column; gap: var(--nm-gap); min-width: 0; min-height: 0; overflow: auto; }
.tile.inset { cursor: pointer; }
.tile.inset .foot, .tile.inset .quick, .tile.inset .readouts, .tile.inset .status .sub, .tile.inset .tl { display: none; }
.tile.inset .who { font-size: 13px; }
.tile.inset .who .where { display: none; }
.tile.inset .status { font-size: 12px; padding: 4px 10px 4px 5px; gap: 6px; }
.tile.inset .status .ic { width: 20px; height: 20px; }
.tile.inset .status .ic svg { width: 14px; height: 14px; }
.tile.inset .ov-bottom { bottom: 8px; left: 8px; right: 8px; }
.tile.inset .ov-top { top: 6px; left: 8px; right: 6px; }
.root.narrow[data-layout='focus'] .grid { grid-template-columns: 1fr; grid-template-rows: auto auto; align-content: start; }
.root.narrow[data-layout='focus'] .insets { grid-column: 1; grid-row: 2; flex-direction: row; overflow: visible; }
.root.narrow[data-layout='focus'] .insets .tile { flex: 1; min-width: 0; }

/* fill layout: tiles stretch to the available height */
.root:not(.narrow)[data-layout='fill'] .grid { grid-auto-rows: minmax(0, 1fr); align-content: stretch; }
.root:not(.narrow)[data-layout='fill'] .tile { min-height: 0; }

/* night */
.root.night .tile { border-color: var(--nm-line); }
.root.night .who, .root.night .status { color: var(--nm-ink); }
.root.night .status { background: rgba(10,6,4,.7); }
.root.night .status.crying { background: var(--nm-cry); color: #fff; }
.root.night .quick .ib, .root.night .readout { background: rgba(10,6,4,.6); color: var(--nm-ink); }
.root.night .scrim.top { background: linear-gradient(rgba(0,0,0,.7), transparent); }
.root.night .tools .ib:not(.on), .root.night .acts .ib:not(.on), .root.night .seg { opacity: .75; }
.root.night .hdr .title { color: var(--nm-fg2); }

@media (max-width: 600px) {
  .root { padding: 4px; --nm-gap: 8px; }
  .ib .lbl { display: none; }
  .ib { padding: 0; min-width: 40px; }
  .seg button { padding: 8px 11px; }
  .status { font-size: 14px; }
  .hdr .title { font-size: 17px; }
  .who { font-size: 14px; }
  .readouts { display: none; }
}
`, Je = `
* { box-sizing: border-box; }
button { font: inherit; }
.ov { ${Et} position: fixed; inset: 0; z-index: 9999; pointer-events: none; font-family: var(--nm-font); color: var(--nm-fg); }
.ov.night { ${Tt} }
.sheet-wrap { position: absolute; inset: 0; background: rgba(0,0,0,.5); pointer-events: auto; display: flex; align-items: center; justify-content: center; animation: fade .15s; }
.sheet { width: min(560px, 94vw); max-height: 86vh; overflow: auto; background: var(--nm-bg); color: var(--nm-fg); border-radius: 22px; padding: 14px 18px 22px; box-shadow: 0 24px 60px rgba(0,0,0,.5); animation: pop .18s; }
.handle { display: none; }
.sheet header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.sheet h2 { margin: 0; font-size: 18px; font-weight: 700; flex: 1; letter-spacing: -.01em; }
.ib { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 12px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; padding: 0; }
.row { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-top: 1px solid var(--nm-line); }
.row:first-child, .section + .row { border-top: 0; }
.row label { flex: 1; font-size: 15px; }
.hint { display: block; color: var(--nm-fg2); font-size: 12px; margin-top: 2px; }
.hint.center { text-align: center; margin: -4px 0 12px; }
.row input[type=range] { width: 150px; accent-color: var(--nm-accent); }
.row .val { width: 34px; text-align: right; color: var(--nm-fg2); font-variant-numeric: tabular-nums; }
select { font: inherit; font-size: 14px; color: var(--nm-fg); background: var(--nm-bg); border: 1px solid var(--nm-line); border-radius: 10px; padding: 7px 10px; }
.switch { width: 46px; height: 26px; border-radius: 13px; border: 0; background: var(--nm-line); position: relative; cursor: pointer; padding: 0; flex: none; }
.switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: left .15s; }
.switch.on { background: var(--nm-quiet); }
.switch.on::after { left: 23px; }
.section { color: var(--nm-fg2); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; margin: 18px 0 2px; }
.section:first-child { margin-top: 4px; }
.pad { display: grid; grid-template-columns: repeat(3, 68px); grid-template-rows: repeat(3, 68px); gap: 8px; justify-content: center; margin: 8px 0 10px; }
.pad button { border-radius: 18px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; display: grid; place-items: center; touch-action: none; user-select: none; -webkit-user-select: none; }
.pad button:active { background: var(--nm-fg); color: var(--nm-bg); }
.pad .c1 { grid-column: 1; grid-row: 2; } .pad .c2 { grid-column: 2; grid-row: 1; } .pad .c3 { grid-column: 3; grid-row: 2; } .pad .c4 { grid-column: 2; grid-row: 3; } .pad .c5 { grid-column: 2; grid-row: 2; }
.btnrow { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.btn { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; font-size: 14px; font-weight: 600; }
.empty { color: var(--nm-fg2); font-size: 14px; padding: 8px 0; margin: 0; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 4px 0 6px; }
.stats div { background: var(--nm-chip); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.stats b { font-size: 22px; font-weight: 700; letter-spacing: -.02em; }
.stats span { color: var(--nm-fg2); font-size: 12px; }
.events { list-style: none; margin: 0; padding: 0; }
.events li { display: flex; gap: 12px; padding: 10px 0; border-top: 1px solid var(--nm-line); font-size: 14px; align-items: baseline; }
.events li:first-child { border-top: 0; }
.events .t { color: var(--nm-fg2); width: 84px; font-variant-numeric: tabular-nums; flex: none; }
.events .w { flex: 1; }
.events .d { color: var(--nm-fg2); font-variant-numeric: tabular-nums; }
.events .d.live { color: var(--nm-cry); font-weight: 600; }
.toasts { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; flex-direction: column; gap: 8px; align-items: center; }
.toast { background: #2a2d35; color: #fff; padding: 10px 16px; border-radius: 12px; font-size: 14px; box-shadow: 0 8px 24px rgba(0,0,0,.4); animation: up .2s; max-width: 90vw; }
.toast.err { background: var(--nm-cry); }
@keyframes fade { from { opacity: 0; } }
@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.98); } }
@keyframes up { from { opacity: 0; transform: translateY(8px); } }
@media (max-width: 600px) {
  .sheet-wrap { align-items: flex-end; }
  .sheet { width: 100%; max-height: 92vh; border-radius: 22px 22px 0 0; padding-bottom: max(22px, env(safe-area-inset-bottom)); animation: slide .2s; }
  .handle { display: block; width: 40px; height: 4px; border-radius: 2px; background: var(--nm-line); margin: 0 auto 12px; }
  @keyframes slide { from { transform: translateY(24px); opacity: 0; } }
}
@media (prefers-reduced-motion: reduce) { .sheet-wrap, .sheet, .toast { animation: none !important; } }
`;
class Xe {
  constructor() {
    this.sheet = null, this.toasts = [], this.night = !1, this.seq = 0, this.onKey = (i) => {
      i.key === "Escape" && this.sheet && this.close();
    }, this.host = document.createElement("div"), this.host.setAttribute("data-nap-monitor-overlay", "");
    const t = this.host.attachShadow({ mode: "open" }), e = document.createElement("style");
    e.textContent = Je, t.appendChild(e), this.container = document.createElement("div"), t.appendChild(this.container), document.addEventListener("keydown", this.onKey), this.attach(document);
  }
  /** Move the overlay into another document (pop-out window) or back. */
  attach(t) {
    (this.host.ownerDocument !== t || !this.host.isConnected) && t.body.appendChild(this.host), this.render();
  }
  get isOpen() {
    return !!this.sheet;
  }
  setNight(t) {
    this.night !== t && (this.night = t, this.render());
  }
  open(t) {
    this.sheet = t, this.render();
  }
  close() {
    const t = this.sheet;
    this.sheet = null, this.render(), t?.onClose?.();
  }
  /** Re-render the open sheet, e.g. after a state change. */
  refresh() {
    this.sheet && this.render();
  }
  toast(t, e = !1) {
    const i = { id: ++this.seq, msg: t, err: e };
    this.toasts = [...this.toasts, i], this.render(), setTimeout(() => {
      this.toasts = this.toasts.filter((s) => s !== i), this.render();
    }, 5e3);
  }
  render() {
    St(
      p`<div class="ov ${this.night ? "night" : ""}">
        ${this.sheet ? p`<div class="sheet-wrap" @click=${() => this.close()}>
              <div class="sheet" role="dialog" aria-modal="true" aria-label=${this.sheet.title} @click=${(t) => t.stopPropagation()}>
                <div class="handle"></div>
                <header>
                  <h2>${this.sheet.title}</h2>
                  <button class="ib" title="Close" aria-label="Close" @click=${() => this.close()}>${g(f.close, 20)}</button>
                </header>
                <div class="body">${this.sheet.body()}</div>
              </div>
            </div>` : u}
        <div class="toasts" aria-live="polite">
          ${this.toasts.map((t) => p`<div class="toast ${t.err ? "err" : ""}">${t.msg}</div>`)}
        </div>
      </div>`,
      this.container
    );
  }
}
function Qe() {
  const n = window;
  return n.__napMonitorOverlay || (n.__napMonitorOverlay = new Xe()), n.__napMonitorOverlay;
}
let D = null, B = null;
function ti() {
  return !!D || !!B;
}
async function ei(n) {
  if (D) {
    D.close();
    return;
  }
  if (B) {
    document.pictureInPictureElement && await document.exitPictureInPicture();
    return;
  }
  if (window.documentPictureInPicture) await ii(n);
  else if (document.pictureInPictureEnabled) await si(n);
  else throw new Error("this browser cannot float windows; use full screen instead");
}
async function ii(n) {
  const t = await window.documentPictureInPicture.requestWindow({ width: 980, height: 420 });
  D = t;
  const e = t.document.createElement("style");
  e.textContent = "body { margin: 0; height: 100vh; background: #0c0e12; color: #f3f4f6; } nap-monitor-card { display: block; height: 100%; }", t.document.head.appendChild(e);
  const i = document.createElement("div");
  i.setAttribute("data-nap-monitor-placeholder", ""), i.style.cssText = "padding:24px;color:var(--secondary-text-color,#9aa3b2);font-size:15px", i.textContent = "Popped out. Close the floating window to bring the monitor back here.", n.card.parentNode?.insertBefore(i, n.card), t.document.body.appendChild(n.card), n.moveOverlay(t.document), n.onChange(!0), t.addEventListener("pagehide", () => {
    i.parentNode?.insertBefore(n.card, i), i.remove(), n.moveOverlay(document), D = null, n.onChange(!1);
  });
}
function T(n, t = 0) {
  if (!n || t > 6) return null;
  if (n.tagName === "VIDEO") return n;
  const e = n.shadowRoot || n, i = e.querySelector ? e.querySelector("video") : null;
  if (i) return i;
  for (const s of Array.from(e.children || [])) {
    const r = T(s, t + 1);
    if (r) return r;
  }
  return null;
}
async function si(n) {
  const t = n.feeds();
  if (!t.length || !t.some((d) => d.video)) throw new Error("no live feeds are showing yet");
  const e = 640, i = 360, s = document.createElement("canvas");
  s.width = e * t.length, s.height = i;
  const r = s.getContext("2d"), o = document.createElement("video");
  o.muted = !0, o.playsInline = !0, o.autoplay = !0, o.width = s.width, o.height = s.height, o.style.cssText = "position:fixed;right:0;bottom:0;width:640px;height:360px;max-width:100vw;opacity:.01;pointer-events:none;z-index:0;background:#000", o.srcObject = s.captureStream(15), document.body.appendChild(o), B = o;
  let l = !0;
  const a = () => {
    l && n.feeds().forEach((d, m) => {
      const v = m * e;
      r.fillStyle = "#000", r.fillRect(v, 0, e, i);
      const _ = d.video;
      if (_) {
        if (_.paused)
          try {
            _.play()?.catch(() => {
            });
          } catch {
          }
        try {
          _.readyState >= 2 && r.drawImage(_, v, 0, e, i);
        } catch {
        }
      }
      const Y = !!(_ && _.readyState >= 2);
      d.crying && (r.strokeStyle = "#ef5350", r.lineWidth = 12, r.strokeRect(v + 6, 6, e - 12, i - 12));
      const U = d.crying ? `${d.name}: crying` : Y ? d.name : `${d.name}: reconnecting`;
      r.font = "600 20px system-ui, sans-serif";
      const b = r.measureText(U).width + 24;
      r.fillStyle = d.crying ? "#ef5350" : "rgba(0,0,0,.55)", r.fillRect(v + 14, 14, b, 34), r.fillStyle = "#fff", r.fillText(U, v + 26, 38);
    });
  };
  let h = null;
  try {
    const d = "let i=setInterval(function(){postMessage(0)},66);onmessage=function(){clearInterval(i)}";
    h = new Worker(URL.createObjectURL(new Blob([d], { type: "text/javascript" }))), h.onmessage = a;
  } catch {
    h = null;
  }
  const c = setInterval(a, h ? 250 : 66);
  a(), await o.play(), o.readyState < 1 && await new Promise((d) => o.addEventListener("loadedmetadata", d, { once: !0 })), await o.requestPictureInPicture(), n.onChange(!0), o.addEventListener("leavepictureinpicture", () => {
    l = !1, h && (h.postMessage(0), h.terminate()), clearInterval(c), o.remove(), B = null, n.onChange(!1);
  });
}
const zt = "nap-monitor-card:prefs:v2";
function bt() {
  try {
    const n = JSON.parse(localStorage.getItem(zt) || "{}");
    return { ...n, children: n.children || {} };
  } catch {
    return { children: {} };
  }
}
function ni(n) {
  try {
    localStorage.setItem(zt, JSON.stringify(n));
  } catch {
  }
}
function w(n) {
  const t = Math.floor(n / 6e4);
  if (t < 1) return "under a minute";
  if (t < 60) return `${t} min`;
  const e = Math.floor(t / 60), i = t % 60;
  return i ? `${e}h ${String(i).padStart(2, "0")}m` : `${e}h`;
}
function ri(n) {
  return new Date(n).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function yt(n, t = Date.now()) {
  const e = new Date(n), i = new Date(t);
  if (e.toDateString() === i.toDateString()) return "Today";
  const s = new Date(i);
  return s.setDate(i.getDate() - 1), e.toDateString() === s.toDateString() ? "Yesterday" : e.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
function $t(n) {
  const t = /^(\d{1,2}):(\d{2})$/.exec(String(n || "").trim());
  return t ? Number(t[1]) * 60 + Number(t[2]) : NaN;
}
function oi(n, t, e) {
  return Number.isNaN(t) || Number.isNaN(e) || t === e ? !1 : t < e ? n >= t && n < e : n >= t || n < e;
}
const F = (n, t) => !!n.hass().states[t];
class ai {
  constructor(t) {
    this.ctx = t, this.timer = null;
  }
  press(t) {
    const e = A(this.ctx.cfg, this.ctx.loc).ptz;
    return this.ctx.call("button", "press", { entity_id: e[t] });
  }
  start(t) {
    this.stopTimer(), this.press(t), this.timer = setInterval(() => this.press(t), 500);
  }
  release() {
    this.timer && (this.stopTimer(), this.press("stop"));
  }
  stopTimer() {
    this.timer && clearInterval(this.timer), this.timer = null;
  }
}
function li(n) {
  const t = new ai(n), e = A(n.cfg, n.loc).ptz, i = (s, r) => p`<button
      class=${r}
      aria-label=${`Move ${s}`}
      @pointerdown=${(o) => {
    o.preventDefault(), t.start(s);
  }}
      @pointerup=${() => t.release()}
      @pointerleave=${() => t.release()}
      @pointercancel=${() => t.release()}
    >
      ${g(f[s], 28)}
    </button>`;
  return {
    title: `${n.child.name} · ${$(n.loc)}`,
    onClose: () => t.stopTimer(),
    body: () => {
      const s = n.hass().states, r = s[e.preset], o = s[e.autoTrack];
      return p`
        ${F(n, e.left) ? p`<div class="pad">
              ${i("up", "c2")} ${i("left", "c1")}
              <button class="c5" aria-label="Stop" @click=${() => t.press("stop")}>${g(f.stop, 24)}</button>
              ${i("right", "c3")} ${i("down", "c4")}
            </div>
            <p class="hint center">Hold a direction to keep moving.</p>` : p`<p class="empty">This camera has no pan or tilt controls in Home Assistant.</p>`}
        ${r ? p`<div class="row">
              <label>Preset position</label>
              <select @change=${(l) => n.call("select", "select_option", { entity_id: e.preset, option: l.target.value })}>
                ${(r.attributes.options || []).map((l) => p`<option ?selected=${l === r.state}>${l}</option>`)}
              </select>
            </div>` : u}
        ${o ? p`<div class="row">
              <label>Follow movement<span class="hint">Camera turns to keep motion in view</span></label>
              ${Pt(o.state === "on", () => n.call("switch", o.state === "on" ? "turn_off" : "turn_on", { entity_id: e.autoTrack }))}
            </div>` : u}
        <div class="btnrow">
          ${F(n, e.guardGo) ? p`<button class="btn" @click=${() => n.call("button", "press", { entity_id: e.guardGo })}>${g(f.home, 18)} Go home</button>` : u}
          ${F(n, e.guardSet) ? p`<button class="btn" @click=${() => n.call("button", "press", { entity_id: e.guardSet })}>${g(f.save, 18)} Save as home</button>` : u}
          ${F(n, e.calibrate) ? p`<button class="btn" @click=${() => n.call("button", "press", { entity_id: e.calibrate })}>${g(f.calibrate, 18)} Recalibrate</button>` : u}
        </div>
      `;
    }
  };
}
function Pt(n, t) {
  return p`<button class="switch ${n ? "on" : ""}" role="switch" aria-checked=${String(n)} @click=${t}></button>`;
}
function ci(n) {
  return {
    title: `${$(n.loc)} camera settings`,
    body: () => {
      const t = n.hass().states, e = We(n.loc.key).filter((s) => !!t[s.id]);
      if (!e.length) return p`<p class="empty">No adjustable settings found for this camera.</p>`;
      const i = [...new Set(e.map((s) => s.section))];
      return p`${i.map(
        (s) => p`
          <div class="section">${s}</div>
          ${e.filter((r) => r.section === s).map((r) => {
          const o = t[r.id], l = r.id.split(".")[0], a = p`<label>${r.label}${r.hint ? p`<span class="hint">${r.hint}</span>` : u}</label>`;
          if (l === "number") {
            const c = o.attributes;
            return p`<div class="row">
                  ${a}
                  <input
                    type="range"
                    min=${c.min ?? 0}
                    max=${c.max ?? 100}
                    step=${c.step ?? 1}
                    .value=${o.state}
                    @input=${(d) => {
              const m = d.target;
              m.nextElementSibling.textContent = m.value;
            }}
                    @change=${(d) => n.call("number", "set_value", { entity_id: r.id, value: Number(d.target.value) })}
                  />
                  <span class="val">${o.state}</span>
                </div>`;
          }
          if (l === "select")
            return p`<div class="row">
                  ${a}
                  <select @change=${(c) => n.call("select", "select_option", { entity_id: r.id, option: c.target.value })}>
                    ${(o.attributes.options || []).map((c) => p`<option ?selected=${c === o.state}>${c}</option>`)}
                  </select>
                </div>`;
          const h = o.state === "on";
          return p`<div class="row">${a}${Pt(h, () => n.call(l === "light" ? "light" : "switch", h ? "turn_off" : "turn_on", { entity_id: r.id }))}</div>`;
        })}
        `
      )}`;
    }
  };
}
function di(n, t, e, i) {
  return {
    title: `${n.child.name}: last ${i} hours`,
    body: () => {
      const s = t();
      if (!s.length) return p`<p class="empty">No crying in the last ${i} hours.</p>`;
      const r = Date.now(), o = s.filter((c) => c.end !== null).map((c) => c.end - c.start), l = o.length ? Math.max(...o) : 0, a = o.reduce((c, d) => c + d, 0), h = [...new Set(s.map((c) => yt(c.start, r)))];
      return p`
        <div class="stats">
          <div><b>${s.length}</b><span>cries</span></div>
          <div><b>${l ? w(l) : "–"}</b><span>longest</span></div>
          <div><b>${a ? w(a) : "–"}</b><span>total</span></div>
        </div>
        ${h.map(
        (c) => p`
            <div class="section">${c}</div>
            <ul class="events">
              ${s.filter((d) => yt(d.start, r) === c).map(
          (d) => p`<li>
                    <span class="t">${ri(d.start)}</span>
                    <span class="w">${e(d.entityId)}</span>
                    <span class="d ${d.end === null ? "live" : ""}">${d.end === null ? "still going" : w(d.end - d.start)}</span>
                  </li>`
        )}
            </ul>
          `
      )}
      `;
    }
  };
}
const et = "nap-monitor-card", X = ["grid", "focus", "fill"], hi = {
  grid: { label: "Grid", icon: f.grid, title: "Layout: grid. Tap for focus" },
  focus: { label: "Focus", icon: f.focus, title: "Layout: focus. Tap for fill" },
  fill: { label: "Fill", icon: f.fill, title: "Layout: fill. Tap for grid" }
}, Q = {
  missing: { icon: f.cameraOff, label: "Camera not found" },
  privacy: { icon: f.privacy, label: "Privacy on" },
  offline: { icon: f.offline, label: "Camera offline" },
  crying: { icon: f.cry, label: "Crying" },
  stirring: { icon: f.motion, label: "Stirring" },
  quiet: { icon: f.sleep, label: "Quiet" },
  live: { icon: f.play, label: "Live" }
};
class pi extends P {
  constructor() {
    super(...arguments), this._prefs = bt(), this._now = Date.now(), this._episodes = {}, this._live = {}, this._popped = !1, this._fullscreen = !1, this._narrow = !1, this._mq = window.matchMedia("(max-width: 760px)"), this._onMq = () => {
      this._narrow = this._mq.matches;
    }, this._overlay = Qe(), this._lastCry = {}, this._seenHass = !1, this._sizeRaf = null, this._onResize = () => this._sizeGridSoon(), this._onFullscreen = () => {
      this._fullscreen = !!document.fullscreenElement, this._sizeGridSoon();
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      _config: { state: !0 },
      _prefs: { state: !0 },
      _now: { state: !0 },
      _episodes: { state: !0 },
      _live: { state: !0 },
      _popped: { state: !0 },
      _fullscreen: { state: !0 },
      _narrow: { state: !0 }
    };
  }
  // ------------------------------------------------------------ HA card API
  setConfig(t) {
    this._config = Be(t), this._prefs = bt(), this._episodes = {}, this._lastCry = {}, this._seenHass = !1;
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: "full", rows: "auto" };
  }
  static getStubConfig() {
    return { children: [{ name: "Child", cameras: [{ key: "nursery", label: "Nursery" }] }] };
  }
  // -------------------------------------------------------------- lifecycle
  createRenderRoot() {
    const t = super.createRenderRoot(), e = document.createElement("style");
    return e.textContent = Ke, t.appendChild(e), t;
  }
  connectedCallback() {
    super.connectedCallback(), this._tick = setInterval(() => {
      this._now = Date.now();
    }, 3e4), this._histTimer = setInterval(() => this._refreshHistory(), 5 * 6e4), this._liveTimer = setInterval(() => this._checkLive(), 1e3), window.addEventListener("resize", this._onResize), document.addEventListener("fullscreenchange", this._onFullscreen), this._narrow = this._mq.matches, this._mq.addEventListener("change", this._onMq), this._ro = new ResizeObserver((t) => t.forEach((e) => this._fitStream(e.target))), this._sizeGridSoon();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._tick), clearInterval(this._histTimer), clearInterval(this._liveTimer), window.removeEventListener("resize", this._onResize), document.removeEventListener("fullscreenchange", this._onFullscreen), this._mq.removeEventListener("change", this._onMq), this._ro?.disconnect(), !ti() && this._overlay.isOpen && this._overlay.close();
  }
  willUpdate(t) {
    !this._config || !this.hass || ((t.has("hass") || t.has("_config")) && this._onStateChange(), this._overlay.setNight(this._night));
  }
  updated(t) {
    (t.has("_prefs") || t.has("_config") || t.has("_fullscreen") || t.has("_narrow")) && this._sizeGridSoon(), t.has("hass") && this._overlay.isOpen && this._overlay.refresh(), this._ro && (this._ro.disconnect(), this.renderRoot.querySelectorAll(".video").forEach((e) => {
      this._ro.observe(e), this._fitStream(e);
    }));
  }
  /** Size the stream so it covers (or fits inside) a stretched video box. */
  _fitStream(t) {
    const e = t.clientWidth, i = t.clientHeight;
    if (!e || !i) return;
    const s = t.querySelector("ha-camera-stream"), r = s ? T(s) : null, o = r && r.videoWidth && r.videoHeight ? r.videoWidth / r.videoHeight : 16 / 9, l = i * o, a = this._config?.fit === "contain" ? Math.min(e, l) : Math.max(e, l);
    t.style.setProperty("--nm-stream-w", `${Math.round(a)}px`);
  }
  // --------------------------------------------------------------- derived
  get _night() {
    const t = this._prefs.night;
    if (t === !0 || t === !1) return t;
    const e = this._config;
    if (e.night_mode === "on") return !0;
    if (e.night_mode === "off") return !1;
    const i = new Date(this._now);
    return oi(i.getHours() * 60 + i.getMinutes(), $t(e.night_start), $t(e.night_end));
  }
  get _layout() {
    return this._prefs.layout || this._config.layout;
  }
  _cp(t) {
    const e = this._prefs.children[t.name] || { loc: t.cameras[0].key, muted: !0, hd: !1 };
    return t.cameras.some((i) => i.key === e.loc) || (e.loc = t.cameras[0].key), this._prefs.children[t.name] = e, e;
  }
  _loc(t) {
    const e = this._cp(t);
    return t.cameras.find((i) => i.key === e.loc) || t.cameras[0];
  }
  _visibleChildren() {
    const t = this._config, e = this._prefs.filter, i = e && e !== "all" ? t.children.find((s) => s.name === e) : void 0;
    return i ? [i] : t.children;
  }
  _save() {
    ni(this._prefs), this._prefs = { ...this._prefs };
  }
  _cryEpisodes(t) {
    return this._episodes[t.name] || [];
  }
  // -------------------------------------------------------- state reactions
  /** Follow crying across a child's locations, refocus, and refresh history on cry edges. */
  _onStateChange() {
    const t = this._config, e = this.hass, i = !this._seenHass;
    this._seenHass = !0;
    let s = !1, r = [];
    for (const o of t.children) {
      const l = this._cp(o);
      let a = null;
      for (const c of o.cameras) {
        const d = S(e, t, c), m = this._lastCry[c.key];
        d && m === !1 && (a = a || c), m !== void 0 && m !== d && r.push(o), this._lastCry[c.key] = d;
      }
      const h = o.cameras.find((c) => c.key === l.loc) || o.cameras[0];
      if (t.follow_cry && !S(e, t, h)) {
        const c = a || (i ? o.cameras.find((d) => S(e, t, d)) : void 0);
        c && c.key !== l.loc && (l.loc = c.key, s = !0);
      }
      a && this._layout === "focus" && this._prefs.focus !== o.name && (this._prefs.focus = o.name, s = !0);
    }
    s && this._save(), i ? this._refreshHistory() : [...new Set(r)].forEach((o) => this._refreshHistory(o));
  }
  async _refreshHistory(t) {
    if (!this.hass || !this._config) return;
    const e = this._config, i = t ? [t] : e.children;
    await Promise.all(
      i.map(async (s) => {
        const r = s.cameras.map((o) => A(e, o).cry).filter((o) => !!this.hass.states[o]);
        try {
          const o = await ce(this.hass, r, Math.max(e.events_hours, e.timeline_hours));
          this._episodes = { ...this._episodes, [s.name]: o };
        } catch {
        }
      })
    );
  }
  /** Mark tiles whose <video> is actually playing so the status can say "connecting" until then. */
  _checkLive() {
    if (!this._config) return;
    let t = !1;
    const e = { ...this._live };
    for (const i of this._config.children) {
      const s = this.renderRoot.querySelector(`[data-child="${CSS.escape(i.name)}"] ha-camera-stream`), r = s ? T(s) : null, o = !!(r && r.readyState >= 2 && !r.paused);
      e[i.name] !== o && (e[i.name] = o, t = !0);
    }
    t && (this._live = e);
  }
  _sizeGridSoon() {
    this._sizeRaf || (this._sizeRaf = requestAnimationFrame(() => {
      this._sizeRaf = null, this._sizeGrid();
    }));
  }
  /** On wide screens Focus and Fill take the rest of the viewport below the card; Grid and phones flow naturally. */
  _sizeGrid() {
    const t = this.renderRoot.querySelector(".grid");
    if (!t) return;
    if (this._layout === "grid" || this._narrow) {
      t.style.height = "";
      return;
    }
    const e = this.ownerDocument.defaultView || window, i = t.getBoundingClientRect(), s = this._fullscreen || this._popped ? i.top : i.top + (e.scrollY || 0), r = Math.max(240, Math.floor(e.innerHeight - s - 12));
    t.style.height = `${r}px`;
  }
  // --------------------------------------------------------------- actions
  _call(t, e, i) {
    return this.hass.callService(t, e, i).catch((s) => this._overlay.toast(`Couldn't do that: ${s?.message || s}`, !0));
  }
  _cycleLayout() {
    this._prefs.layout = X[(X.indexOf(this._layout) + 1) % X.length], this._save();
  }
  _cycleNight() {
    if (this._config.night_mode === "auto") {
      const e = this._prefs.night;
      this._prefs.night = e == null ? !0 : e === !0 ? !1 : null;
    } else
      this._prefs.night = !this._night;
    this._save();
  }
  _setFilter(t) {
    this._prefs.filter = t, this._save();
  }
  _setLocation(t, e) {
    this._cp(t).loc = e, this._save();
  }
  _toggleMute(t) {
    const e = this._cp(t);
    if (e.muted = !e.muted, !e.muted && this._config.exclusive_audio)
      for (const i of this._config.children) i !== t && (this._cp(i).muted = !0);
    this._save();
  }
  _toggleHd(t) {
    const e = this._cp(t), i = this._loc(t);
    if (!e.hd && !this.hass.states[A(this._config, i).cameraHd]) {
      this._overlay.toast(`No HD stream for ${$(i)} yet`);
      return;
    }
    e.hd = !e.hd, this._save();
  }
  _focusOn(t) {
    this._prefs.focus = t.name, this._save();
  }
  async _fullscreenAll() {
    const t = this.renderRoot.querySelector(".root");
    try {
      document.fullscreenElement ? await document.exitFullscreen() : await t.requestFullscreen();
    } catch (e) {
      this._overlay.toast(`Full screen failed: ${e?.message || e}`, !0);
    }
  }
  async _fullscreenTile(t) {
    const e = this.renderRoot.querySelector(`[data-child="${CSS.escape(t.name)}"] .video`), i = e ? T(e.querySelector("ha-camera-stream")) : null;
    try {
      if (i?.webkitEnterFullscreen && (!e.requestFullscreen || /iPhone|iPad|iPod/.test(navigator.userAgent))) {
        i.webkitEnterFullscreen();
        return;
      }
      if (e.requestFullscreen) await e.requestFullscreen();
      else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
      else throw new Error("not supported here");
      try {
        await screen.orientation?.lock?.("landscape");
      } catch {
      }
    } catch (s) {
      this._overlay.toast(`Full screen failed: ${s?.message || s}`, !0);
    }
  }
  async _popOut() {
    try {
      await ei({
        card: this,
        feeds: () => this._visibleChildren().map((t) => {
          const e = this.renderRoot.querySelector(`[data-child="${CSS.escape(t.name)}"] ha-camera-stream`);
          return { name: t.name, video: e ? T(e) : null, crying: S(this.hass, this._config, this._loc(t)) };
        }),
        onChange: (t) => {
          this._popped = t, this._sizeGridSoon();
        },
        moveOverlay: (t) => this._overlay.attach(t)
      });
    } catch (t) {
      this._overlay.toast(`Pop out failed: ${t?.message || t}`, !0);
    }
  }
  _sheetCtx(t) {
    return { hass: () => this.hass, cfg: this._config, child: t, loc: this._loc(t), call: (e, i, s) => this._call(e, i, s) };
  }
  _openPtz(t) {
    this._overlay.open(li(this._sheetCtx(t)));
  }
  _openSettings(t) {
    this._overlay.open(ci(this._sheetCtx(t)));
  }
  _openHistory(t) {
    const e = this._config, i = (s) => {
      const r = t.cameras.find((o) => A(e, o).cry === s);
      return r ? $(r) : s;
    };
    this._refreshHistory(t), this._overlay.open(di(this._sheetCtx(t), () => this._cryEpisodes(t).filter((s) => s.start > Date.now() - e.events_hours * 36e5 || s.end === null), i, e.events_hours));
  }
  // ---------------------------------------------------------------- render
  render() {
    if (!this._config) return u;
    if (!this.hass) return p`<div class="root"><p class="nostream">Waiting for Home Assistant…</p></div>`;
    this._config;
    const t = this._layout, e = this._night, i = this._visibleChildren(), s = t === "focus" && i.length > 1 ? i.find((r) => r.name === this._prefs.focus) || i[0] : null;
    return p`<div class=${y({ root: !0, night: e, narrow: this._narrow })} data-layout=${t}>
      ${this._renderHeader(i, e)}
      <div class="grid" data-n=${String(i.length)}>
        ${s ? p`${this._renderTile(s, "main")}<div class="insets">${i.filter((r) => r !== s).map((r) => this._renderTile(r, "inset"))}</div>` : i.map((r) => this._renderTile(r, "plain"))}
      </div>
    </div>`;
  }
  _renderHeader(t, e) {
    const i = this._config, s = this._prefs.filter && i.children.some((a) => a.name === this._prefs.filter) ? this._prefs.filter : "all", r = hi[this._layout], o = i.night_mode === "auto" ? this._prefs.night == null ? "Night mode: automatic" : e ? "Night mode: on" : "Night mode: off" : e ? "Night mode on" : "Night mode off", l = i.night_mode === "auto" && this._prefs.night == null ? f.nightAuto : e ? f.night : f.day;
    return p`<header class="hdr">
      ${i.title ? p`<span class="title">${i.title}</span>` : u}
      ${i.children.length > 1 ? p`<div class="seg" role="tablist" aria-label="Which child to show">
            <button role="tab" class=${y({ on: s === "all" })} aria-selected=${String(s === "all")} @click=${() => this._setFilter("all")}>${g(f.kids, 16)} All</button>
            ${i.children.map((a) => {
      const h = a.cameras.some((c) => S(this.hass, i, c));
      return p`<button role="tab" class=${y({ on: s === a.name })} aria-selected=${String(s === a.name)} @click=${() => this._setFilter(a.name)}>
                ${h ? p`<span class="dot" aria-label="crying"></span>` : u}${a.name}
              </button>`;
    })}
          </div>` : u}
      <div class="tools">
        ${i.tv_scripts.map((a) => p`<button class="chip" title=${`Show on ${a.name}`} @click=${() => this._call("script", "turn_on", { entity_id: a.script })}>${g(f.tv, 18)}<span class="lbl">${a.name}</span></button>`)}
        ${t.length > 1 ? p`<button class="ib" title=${r.title} aria-label=${r.title} @click=${() => this._cycleLayout()}>${g(r.icon, 20)}<span class="lbl">${r.label}</span></button>` : u}
        <button class=${y({ ib: !0, on: e })} title=${o} aria-label=${o} aria-pressed=${String(e)} @click=${() => this._cycleNight()}>${g(l, 20)}<span class="lbl">Night</span></button>
        <button class=${y({ ib: !0, on: this._popped })} title="Float as a small window" aria-label="Pop out" @click=${() => this._popOut()}>${g(f.pip, 20)}</button>
        <button class="ib" title=${this._fullscreen ? "Exit full screen" : "Full screen"} aria-label="Full screen" @click=${() => this._fullscreenAll()}>${g(this._fullscreen ? f.fullscreenExit : f.fullscreen, 20)}</button>
      </div>
    </header>`;
  }
  _renderTile(t, e) {
    const i = this._config, s = this.hass, r = this._cp(t), o = this._loc(t), l = A(i, o), a = Ge(s, i, o, r.hd), h = s.states[a.cameraId], c = !!h && a.kind !== "privacy" && a.kind !== "offline", d = !!this._live[t.name], m = e === "inset", v = t.color ? { "--accent": t.color } : {}, _ = i.show_sensors && !m ? (o.sensors || []).map((b) => Ye(s, b)).filter((b) => !!b) : [], Y = !!s.states[l.ptz.left] || !!s.states[l.ptz.preset], U = !this._narrow && (this._layout === "fill" || e === "main");
    return p`<section
      class=${y({ tile: !0, main: e === "main", inset: m, crying: a.kind === "crying" })}
      data-child=${t.name}
      style=${le(v)}
      aria-label=${`${t.name}, ${Q[a.kind].label}`}
      @click=${m ? () => this._focusOn(t) : u}
    >
      <div class=${y({ video: !0, stretch: U, connecting: c && !d })}>
        ${c ? oe(
      a.cameraId,
      p`<ha-camera-stream .hass=${s} .stateObj=${h} .muted=${r.muted} .controls=${!1} .allowExoPlayer=${i.native_player}></ha-camera-stream>`
    ) : this._renderNoStream(a, o)}
        <div class="scrim top"></div>
        <div class="scrim bottom"></div>
        <div class="ov-top">
          <div class="who">
            <span class="avatar"></span>
            <span class="name">${t.name}</span>
            ${t.cameras.length > 1 ? p`<span class="where">${$(o)}</span>` : u}
          </div>
          <div class="quick">
            <button class=${y({ ib: !0, on: !r.muted })} title=${r.muted ? "Unmute" : "Mute"} aria-label=${r.muted ? "Unmute" : "Mute"} aria-pressed=${String(!r.muted)} @click=${(b) => {
      b.stopPropagation(), this._toggleMute(t);
    }}>${g(r.muted ? f.muted : f.sound, 18)}</button>
            <button class="ib" title="Full screen this camera" aria-label="Full screen this camera" @click=${(b) => {
      b.stopPropagation(), this._fullscreenTile(t);
    }}>${g(f.fullscreen, 18)}</button>
          </div>
        </div>
        <div class="ov-bottom">
          ${this._renderStatus(a, c && !d)}
          ${a.kind === "privacy" ? p`<button class="btn resume" @click=${(b) => {
      b.stopPropagation(), this._call("switch", "turn_off", { entity_id: l.privacy });
    }}>${g(f.play, 18)} Resume</button>` : u}
          ${_.length ? p`<div class="readouts">${_.map((b) => p`<span class="readout">${b}</span>`)}</div>` : u}
        </div>
        ${i.show_timeline && !m ? this._renderTimeline(t) : u}
      </div>
      ${m ? u : this._renderFoot(t, o, r, Y)}
    </section>`;
  }
  _renderNoStream(t, e) {
    const i = Q[t.kind], s = t.kind === "missing" ? `Looking for ${t.cameraId}` : t.kind === "privacy" ? "The lens is turned away. Resume to watch." : t.kind === "offline" ? `${$(e)} camera is not responding` : "";
    return p`<div class="nostream">${g(i.icon, 40)}<b>${i.label}</b>${s ? p`<span>${s}</span>` : u}</div>`;
  }
  _renderStatus(t, e) {
    const i = Q[t.kind];
    this._now;
    const s = t.since != null ? Math.max(0, Date.now() - t.since) : null;
    let r = "";
    return t.kind === "crying" && s != null ? r = `for ${w(s)}` : t.kind === "quiet" && s != null ? r = `for ${w(s)}` : t.kind === "stirring" && s != null ? r = `quiet for ${w(s)}` : t.kind === "privacy" && s != null ? r = `since ${w(s)} ago` : t.kind === "offline" && s != null && (r = `for ${w(s)}`), e && (t.kind === "quiet" || t.kind === "live" || t.kind === "stirring") && (r = r ? `${r} · connecting…` : "connecting…"), p`<div class="status ${t.kind}" role="status">
      <span class="ic">${g(i.icon, 18)}</span>
      <span class="txt"><span class="label">${i.label}</span>${r ? p`<span class="sub">${r}</span>` : u}</span>
    </div>`;
  }
  /** Thin strip along the bottom of the video: red marks where crying happened in the last N hours. */
  _renderTimeline(t) {
    const e = this._config.timeline_hours, i = this._now, s = i - e * 36e5, r = 1e3, o = (c) => Math.max(0, Math.min(r, (c - s) / (i - s) * r)), l = this._cryEpisodes(t).filter((c) => c.end === null || c.end > s), a = [], h = new Date(s);
    h.setMinutes(0, 0, 0);
    for (let c = h.getTime() + 36e5; c < i; c += 36e5) new Date(c).getHours() % 3 === 0 && a.push(c);
    return J`<svg class="tl" viewBox="0 0 ${r} 6" preserveAspectRatio="none" aria-label=${`Crying in the last ${e} hours: ${l.length} episode${l.length === 1 ? "" : "s"}`}>
      <rect class="track" x="0" y="0" width=${r} height="6"></rect>
      ${a.map((c) => J`<line x1=${o(c)} x2=${o(c)} y1="0" y2="6"></line>`)}
      ${l.map((c) => {
      const d = o(c.start), m = c.end === null ? r : o(c.end);
      return J`<rect class="ep" x=${d} y="0" width=${Math.max(3, m - d)} height="6"></rect>`;
    })}
    </svg>`;
  }
  _renderFoot(t, e, i, s) {
    const r = this._config, o = this.hass, l = t.cameras.length > 1, a = this._cryEpisodes(t).filter((h) => h.end === null || h.end > this._now - r.timeline_hours * 36e5).length;
    return p`<div class="foot">
      ${l ? p`<div class="locs" role="tablist" aria-label=${`Where ${t.name} is sleeping`}>
            ${t.cameras.map((h) => {
      const c = h.key === e.key, d = !c && S(o, r, h);
      return p`<button role="tab" class=${y({ loc: !0, on: c })} aria-selected=${String(c)} title=${d ? `Crying detected in ${$(h)}` : $(h)} @click=${() => this._setLocation(t, h.key)}>
                ${$(h)}${d ? p`<span class="dot"></span>` : u}
              </button>`;
    })}
          </div>` : u}
      <div class="acts">
        <button class=${y({ ib: !0, txt: !0, on: i.hd })} title="Switch between HD and low-bandwidth stream" aria-pressed=${String(i.hd)} @click=${() => this._toggleHd(t)}>HD</button>
        ${s ? p`<button class="ib" title="Move camera" aria-label="Move camera" @click=${() => this._openPtz(t)}>${g(f.move, 20)}</button>` : u}
        <button class="ib" title="Camera settings" aria-label="Camera settings" @click=${() => this._openSettings(t)}>${g(f.tune, 20)}</button>
        <button class="ib" title=${`Cry history: ${a} in the last ${r.timeline_hours} hours`} aria-label="Cry history" @click=${() => this._openHistory(t)}>${g(f.history, 20)}${a ? p`<span class="lbl">${a}</span>` : u}</button>
      </div>
    </div>`;
  }
}
customElements.get(et) || customElements.define(et, pi);
window.customCards = window.customCards || [];
window.customCards.push({
  type: et,
  name: "Nap Monitor",
  description: "Nursery monitor: one tile per child, several sleep locations, cry awareness and night mode",
  preview: !1
});
console.info(
  "%c NAP-MONITOR-CARD %c 0.1.0 ",
  "color: #181b22; background: #8fd3a7; font-weight: 700",
  "color: #8fd3a7; background: #181b22"
);
