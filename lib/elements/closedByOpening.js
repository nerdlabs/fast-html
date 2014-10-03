var closedByOpeningElementTagNames = {
    li: {
        li: true
    },
    p: {
        p: true,
        div: true
    },
    td: {
        td: true,
        th: true
    },
    th: {
        td: true,
        th: true
    }
};

module.exports = closedByOpeningElementTagNames;
