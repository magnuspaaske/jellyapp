// src/subpage
// Functionality so a subpage can be rendered inside the rendering of a main page

getSubpage = async (subpageFn, req, res, next) => {
    let producedHtml

    const subres = Object.assign({}, res, {
        render: async (file, locals) => {
            const usedLocals = Object.assign({}, res.locals, locals)
            const html = await new Promise((resolve, reject) => {
                res.render(file, usedLocals, (err, html) => {
                    if (err) throw err
                    resolve(html)
                })
            })
            producedHtml = html
        }
    })

    await subpageFn(req, subres, next)

    return producedHtml
}

module.exports = getSubpage
