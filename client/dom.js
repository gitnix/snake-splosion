const idFor = (id, prop) => document.getElementById(`p${id}-${prop}`)
const updateDOM = (id, prop, value, extra = '') =>
	(idFor(id, prop).innerHTML = value + extra)

export { idFor, updateDOM }
