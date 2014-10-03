var closedByClosingElementTagNames = {
    li: {
        ul: true,
        ol: true
    },
    p: {
        div: true
    },
    td: {
        tr: true,
        table: true
    },
    th: {
        tr: true,
        table: true
    }
};

module.exports = closedByClosingElementTagNames;
