import { init } from 'snabbdom/build/package/init.js'
import { classModule } from 'snabbdom/build/package/modules/class.js'
import { propsModule } from 'snabbdom/build/package/modules/props.js'
import { styleModule } from 'snabbdom/build/package/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners.js'
import { h } from 'snabbdom/build/package/h.js'

const patch = init([classModule, propsModule, styleModule, eventListenersModule])

let vnode = null
let nextKey = 2
let margin = 8
let sortBy = 'rank'
let totalHeight = 0
let originalData = [
  { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0 },
  { rank: 2, title: 'The Movie', desc: 'Movie', elmHeight: 0 }

]
let data = [
  originalData[0]
]

function view (data) {
  return h('div', [
    h('h1', 'Top 10 movies'),
    h('div', [
      h('a.btn.add', { on: { click: add } }, 'Add'),
      'Sort by: ',
      h('span.btn-group', [
        h('a.btn.rank', { class: { active: sortBy === 'rank' }, on: { click: () => {
          changeSort('rank')
        }} }, 'Rank'),
        h('a.btn.title', { class: { active: sortBy === 'title' }, on: { click:  () => {
          changeSort('title')
        } } }, 'Title'),
        h('a.btn.desc', { class: { active: sortBy === 'desc' }, on: { click: () => {
          changeSort('desc')
        }} }, 'Description'),
      ]),
    ]),
    h('div.list', { style: { height: totalHeight + 'px' } }, data.map(movieView)),
  ])
}

function render () {
  data = data.reduce((acc, m) => {
    var last = acc[acc.length - 1]
    m.offset = last ? last.offset + last.elmHeight + margin : margin
    return acc.concat(m)
  }, [])
  totalHeight = data.length === 0
    ? 0
    : data[data.length - 1].offset + data[data.length - 1].elmHeight
  vnode = patch(vnode, view(data))
}
window.addEventListener('DOMContentLoaded', () => {
  var container = document.getElementById('container')
  vnode = patch(container, view(data))
  render()
})

function movieView (movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } },
  }, [
    h('div', { style: { fontWeight: 'bold' } }, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.btn.rm-btn', { on: { click: () => {
      remove(movie)
    }}}, 'x'),
  ])
}


function changeSort (prop) {
  sortBy = prop
  data.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1
    }
    if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  })
  render()
}

function add () {
  var n = originalData[Math.floor(Math.random() * 2)]
  data = [{ rank: nextKey++, title: n.title, desc: n.desc, elmHeight: 0 }].concat(data)
  render()
  render()
}

function remove (movie) {
  data = data.filter((m) => {
    return m !== movie
  })
  render()
}

function movieView (movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } },
  }, [
    h('div', { style: { fontWeight: 'bold' } }, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.btn.rm-btn', { on: { click: () => {
      remove(movie)
    }}}, 'x'),
  ])
}

function render () {
  data = data.reduce((acc, m) => {
    var last = acc[acc.length - 1]
    m.offset = last ? last.offset + last.elmHeight + margin : margin
    return acc.concat(m)
  }, [])
  totalHeight = data.length === 0
    ? 0
    : data[data.length - 1].offset + data[data.length - 1].elmHeight
  vnode = patch(vnode, view(data))
}
