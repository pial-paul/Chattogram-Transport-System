(function (root) {
  const sources = {
    field: {
      name: 'Chattogram Pratidin',
      date: '2026-09-03',
      url: 'https://storage.googleapis.com/qurium/ctgpratidin.com/%E0%A6%9A%E0%A6%9F%E0%A7%8D%E0%A6%9F%E0%A6%97%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A7%87-%E0%A6%AD%E0%A6%BE%E0%A7%9C%E0%A6%BE-%E0%A6%A8%E0%A6%BF%E0%A7%9F%E0%A7%87-%E0%A6%A6.html',
    },
    guide: {
      name: 'Chittagong bus guide',
      url: 'https://en.wikivoyage.org/wiki/Chittagong#By_bus',
    },
    survey: {
      name: 'Chittagong transport study · §8.5.1',
      url: 'https://documents1.worldbank.org/curated/en/650711551757596693/pdf/Deliverable-2-Pre-Feasibility-BRT-final.pdf#page=110',
    },
    fare: {
      name: 'Road Transport and Highways Division',
      date: '2026-09-23',
      url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-rthd/2026/8/2f739bb6-8c27-47eb-90e1-001594d186d5.pdf',
    },
  };

  // Coordinates position landmarks on the schematic, in drawing units.
  const stopRows = [
    ['new-market', 'New Market', 'নিউ মার্কেট', 319, 287, ['newmarket', 'নিউমার্কেট', 'new market bus stand']],
    ['laldighi', 'Laldighi', 'লালদীঘি', 374, 304, ['lal dighi', 'লালদিঘি']],
    ['anderkilla', 'Anderkilla', 'আন্দরকিল্লা', 417, 276, ['andarkilla']],
    ['jamal-khan', 'Jamal Khan', 'জামালখান', 405, 250, ['jamalkhan', 'জামালখাঁন']],
    ['chawkbazar', 'Chawkbazar', 'চকবাজার', 462, 228, ['chowk bazar', 'chawk bazar', 'chawkbazaar']],
    ['probartak', 'Probartak', 'প্রবর্তক', 407, 184, ['medical', 'probortok', 'প্রবর্তক মোড়', 'মেডিকেল']],
    ['gate-2', '2 No. Gate', '২ নম্বর গেট', 388, 141, ['2 no gate', '2 number gate', '2no gate', 'two no gate', '২ নং গেট', '২ নম্বর গেইট', '২নং গেট']],
    ['muradpur', 'Muradpur', 'মুরাদপুর', 452, 138, ['muradpur more']],
    ['bahaddarhat', 'Bahaddarhat', 'বহদ্দারহাট', 522, 176, ['bahaddar hat', 'baddarhat', 'বহদ্দার হাট']],
    ['kaptai-road', 'Kaptai Rastar Matha', 'কাপ্তাই রাস্তার মাথা', 574, 147, ['kaptai road junction']],
    ['kalurghat', 'Kalurghat', 'কালুরঘাট', 626, 105, ['kalur ghat', 'kalurghat bus station']],
    ['kazir-dewri', 'Kazir Dewri', 'কাজীর দেউরী', 353, 230, ['kazir deuri', 'কাজীর দেউরি']],
    ['oxygen', 'Oxygen', 'অক্সিজেন', 441, 84, ['oxygen more', 'oxygen moor', 'oxygen circle', 'অক্সিজেন মোড়', 'অক্সিজেন মোড়']],
    ['aman-bazar', 'Aman Bazar', 'আমান বাজার', 459, 57, ['amanbazar', 'আমানবাজার']],
    ['fatehabad', 'Fatehabad', 'ফতেয়াবাদ', 481, 28, ['fateyabad', 'ফতেয়াবাদ']],
    ['tigerpass', 'Tigerpass', 'টাইগারপাস', 282, 216, ['tiger pass', 'টাইগার পাস']],
    ['lalkhan-bazar', 'Lalkhan Bazar', 'লালখান বাজার', 288, 175, ['lalkhan bazaar', 'lal khan bazar', 'লালখাঁন বাজার']],
    ['wasa', 'WASA', 'ওয়াসা', 300, 146, ['wasa circle', 'ওয়াসা মোড়']],
    ['gec', 'GEC Circle', 'জিইসি মোড়', 331, 125, ['gec', 'gec more', 'gec mor', 'জিইসি', 'জিইসি মোড়']],
    ['jhautola', 'Jhautola', 'ঝাউতলা', 268, 104, ['jhautala']],
    ['ak-khan', 'A.K. Khan', 'এ কে খান', 216, 75, ['ak khan', 'a k khan', 'একে খান']],
    ['colonel-hat', 'Colonel Hat', 'কর্নেল হাট', 188, 53, ['colonelhat', 'কর্ণেল হাট']],
    ['bhatiari', 'Bhatiari', 'ভাটিয়ারী', 155, 25, ['vatiary', 'ভাটিয়ারী', 'ভাটিয়ারি']],
    ['dewanhat', 'Dewanhat', 'দেওয়ানহাট', 255, 239, ['dewan hat', 'দেওয়ানহাট']],
    ['agrabad', 'Agrabad (Badamtoli)', 'আগ্রাবাদ (বাদামতলী)', 217, 264, ['agrabad', 'badamtoli', 'badamtali', 'আগ্রাবাদ', 'বাদামতলী']],
    ['barek', 'Barek Building', 'বারিক বিল্ডিং', 192, 282, ['barik building', 'বারেক বিল্ডিং']],
    ['saltgola', 'Saltgola Crossing', 'সল্টগোলা ক্রসিং', 158, 295, ['saltgola', 'সল্টগোলা']],
    ['epz', 'Chattogram EPZ', 'চট্টগ্রাম ইপিজেড', 126, 318, ['epz', 'cepz', 'ইপিজেড', 'সিইপিজেড']],
    ['bandartila', 'Bandartila', 'বন্দরটিলা', 102, 339, ['bandar tila', 'bandortila']],
    ['cement', 'Cement Crossing', 'সিমেন্ট ক্রসিং', 81, 358, ['cement']],
    ['katgor', 'Katgor', 'কাটগড়', 61, 377, ['katgar', 'kathgar', 'কাঠগড়', 'কাঠগড়']],
    ['patenga', 'Patenga Sea Beach', 'পতেঙ্গা সমুদ্র সৈকত', 39, 406, ['patenga', 'sea beach', 'potenga', 'পতেঙ্গা', 'সি বিচ']],
    ['bayazid', 'Bayazid Bostami', 'বায়েজিদ বোস্তামী', 382, 94, ['bayezid', 'bayazid', 'বায়েজিদ', 'বায়েজিদ']],
    ['naya-bazar', 'Naya Bazar', 'নয়া বাজার', 184, 154, ['nayabazar', 'নয়াবাজার']],
    ['boropole', 'Boropole', 'বড়পোল', 164, 220, ['barapool', 'boropol', 'বড়পোল']],
  ];

  const stops = Object.fromEntries(stopRows.map(([id, en, bn, x, y, aliases]) => [id, { id, en, bn, x, y, aliases }]));
  const coastal = ['dewanhat', 'agrabad', 'barek', 'saltgola', 'epz', 'bandartila', 'cement', 'katgor'];
  const routes = [
    { id: '2', color: '#7544ad', stops: ['new-market', 'laldighi', 'anderkilla', 'jamal-khan', 'chawkbazar', 'probartak', 'gate-2', 'muradpur', 'bahaddarhat', 'kaptai-road'], sources: ['guide'] },
    { id: '3', color: '#c34c28', stops: ['new-market', 'kazir-dewri', 'probartak', 'muradpur', 'oxygen', 'aman-bazar', 'fatehabad'], sources: ['field'], reportedOn: '2026-09-03', kind: 'minibus' },
    { id: '4', color: '#487237', stops: ['new-market', 'tigerpass', 'lalkhan-bazar', 'wasa', 'gec', 'jhautola', 'ak-khan', 'colonel-hat', 'bhatiari'], sources: ['guide', 'survey'] },
    { id: '6', color: '#214fc5', stops: ['laldighi', 'new-market', 'tigerpass', ...coastal, 'patenga'], sources: ['guide', 'survey'] },
    { id: '8', color: '#087c75', stops: ['new-market', 'tigerpass', 'lalkhan-bazar', 'gec', 'gate-2', 'bayazid', 'oxygen'], sources: ['guide', 'survey'] },
    { id: '10', color: '#9a4874', stops: ['kalurghat', 'kaptai-road', 'bahaddarhat', 'muradpur', 'gate-2', 'gec', 'lalkhan-bazar', 'tigerpass', ...coastal], sources: ['guide', 'survey'] },
    { id: '11', color: '#78632b', stops: ['bhatiari', 'colonel-hat', 'ak-khan', 'naya-bazar', 'boropole', 'saltgola', 'epz', 'bandartila', 'katgor', 'patenga'], sources: ['guide', 'survey'] },
  ];

  const data = { stops, routes, sources };
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.TransitData = data;
})(globalThis);
