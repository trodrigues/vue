/* @flow */

import { isIE9, namespaceMap } from 'web/util/index'

const svgNS = namespaceMap.svg

/**
 * In IE9, setAttribute('class') will result in empty class
 * if the element also has the :class attribute; However in
 * PhantomJS, setting `className` does not work on SVG elements...
 * So we have to do a conditional check here.
 */
export function setClass (el: Element, cls: string) {
  /* istanbul ignore else */
  if (!isIE9 || el.namespaceURI === svgNS) {
    el.setAttribute('class', cls)
  } else {
    el.className = cls
  }
}

/**
 * Add class with compatibility for IE & SVG
 */
export function addClass (el: Element, cls: string) {
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(c => el.classList.add(c))
    } else {
      el.classList.add(cls)
    }
  } else {
    const cur = ' ' + getClass(el) + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 */
export function removeClass (el: Element, cls: string) {
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(c => el.classList.remove(c))
    } else {
      el.classList.remove(cls)
    }
  } else {
    let cur = ' ' + getClass(el) + ' '
    const tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    setClass(el, cur.trim())
  }
  if (!el.className) {
    el.removeAttribute('class')
  }
}

/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value... but className
 * on SVG elements returns an object.
 */
function getClass (el: Element): string {
  let classname = el.className
  if (typeof classname === 'object') {
    classname = classname.baseVal || ''
  }
  return classname
}