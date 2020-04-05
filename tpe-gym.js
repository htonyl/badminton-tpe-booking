const request = require('request-promise');

const year = 2020;
const month = 4;
const today = new Date().getDate();

const time = ['1700', '1800', '1900', '2000', '2100'];
const venueSNs = {
    727: 'Court 01',
    728: 'Court 02',
    729: 'Court 03',
    730: 'Court 04',
    731: 'Court 05',
    732: 'Court 06',
    733: 'Court 07',
    734: 'Court 08',
    735: 'Court 09',
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
.then(_ => {
    const resultObj = {};
    result.forEach(r => {
        let key = `${month}/${r.date} ${r.time}`;
        if (resultObj[key] === undefined) {
            resultObj[key] = [r.court];
        } else {
            resultObj[key].push(r.court);
        }
    })
    let resultStr = Object.keys(resultObj).map(key => {
        let courts = resultObj[key].sort();
        return `${key}: ${courts.join(", ")}`;
    });
    resultStr.sort();
    resultStr.forEach(r => console.log(r));
});
