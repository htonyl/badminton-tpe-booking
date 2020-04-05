const request = require('request-promise');

const year = 2020;
const month = 4;
const today = new Date().getDate();

const time = ['1700', '1800', '1900', '2000', '2100'];
const venueSNs = {
    727: 'Court 1',
    728: 'Court 2',
    729: 'Court 3',
    730: 'Court 4',
    731: 'Court 5',
    732: 'Court 6',
    733: 'Court 7',
    734: 'Court 8',
    735: 'Court 9',
    736: 'Court 10'
};

const result = [];

const promise = Object.keys(venueSNs).map(venue => {
    let options = {
        'method': 'POST',
        'url': 'https://sports.tms.gov.tw/_/x/xhrworkv3.php',
        formData: {
          'FUNC': 'LoadSched',
          'SY': year,
          'SM': month,
          'VenueSN': venue
        }
    };

    return request(options, (err, res) => { 
        if (err) throw new Error(err);
        let data = JSON.parse(res.body);
        Object.keys(data['RT']).forEach(k => {
          let day = data['RT'][k];
          time.map(t => {
              if (k >= today && k <= today + 14) {
                  if (day[t]['M'] === '')
                    result.push({
                        'court': venueSNs[venue],
                        'date': k,
                        'time': t
                    })
              }
          });
        });
    });      
});

Promise.all(promise)
.then(x=> {
    let resultStr = result.map(item => {
        return `4/${item.date} ${item.time} ${item.court}`;
    });
    resultStr.sort();
    resultStr.forEach(r => console.log(r));
});
