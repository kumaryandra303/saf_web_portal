// JSON utility functions
module.exports = {
    processData: function(data) {
        if (Array.isArray(data)) {
            return data.map(item => item.tnt_id || item).join(',');
        }
        return data;
    },

    groupJsonByKey: function(data, parentKeys, childKeys, childArrayName, ...groupKeys) {
        // Simplified grouping utility
        const grouped = {};
        
        data.forEach(item => {
            const key = item[parentKeys[0]];
            if (!grouped[key]) {
                grouped[key] = {};
                parentKeys.forEach(pKey => {
                    grouped[key][pKey] = item[pKey];
                });
                grouped[key][childArrayName] = [];
            }
            
            const childObj = {};
            childKeys.forEach(cKey => {
                childObj[cKey] = item[cKey];
            });
            grouped[key][childArrayName].push(childObj);
        });
        
        return Object.values(grouped);
    }
};





