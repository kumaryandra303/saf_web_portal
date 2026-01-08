// Banner utility
module.exports = {
    startPrint: function(url) {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                   SERVER STARTED                          ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║  URL: ${url.padEnd(50)} ║`);
        console.log('╚════════════════════════════════════════════════════════════╝\n');
    }
};





