// Translations of existing source statements. Product data, numbers and scoring are unchanged.
const USAGE={
 cleansing:{en:'Massage onto a dry face, then gently remove with lukewarm water.',zh:'在干燥面部按摩后，用温水轻柔洗净。',ja:'乾いた顔になじませ、ぬるま湯でやさしく洗い流してください。'},
 bubbleToner:{en:'Apply 2–3 pumps of foam to the face and allow it to absorb.',zh:'将2～3泵泡沫涂于面部并轻拍吸收。',ja:'2～3プッシュの泡を顔にのせ、なじませてください。'},
 essenceToner:{en:'Use morning and evening; layer as needed during periods of sensitivity.',zh:'早晚使用；敏感时期可叠加涂抹。',ja:'朝晩使用。敏感な時期は重ね付けしてください。'},
 repairAmpoule:{en:'After toner, layer over the face or target areas of concern.',zh:'爽肤水后涂于全脸，或在关注部位叠加使用。',ja:'化粧水の後、顔全体または気になる部分に重ね付けしてください。'},
 serum:{en:'After toner, dispense a suitable amount and allow it to absorb.',zh:'爽肤水后取适量涂抹并吸收。',ja:'化粧水の後、適量をなじませてください。'},
 soothingCream:{en:'Apply a suitable amount after serum, morning and evening.',zh:'早晚在精华后取适量涂抹。',ja:'朝晩、美容液の後に適量を塗布してください。'},
 richCream:{en:'Recommended for the evening routine. A second layer may be applied to dry areas or areas of firmness concern.',zh:'建议晚间使用，可在干燥或弹力困扰部位叠加涂抹。',ja:'夜のお手入れにおすすめ。乾燥やハリが気になる部分には重ね付けもできます。'},
 soothingGel:{en:'Use as needed, or alone as a lightweight moisturizer.',zh:'按需使用，或单独作为轻盈保湿产品使用。',ja:'必要に応じて使用するか、軽い保湿剤として単独で使用してください。'},
 comfortCream:{en:'Apply generously as a daily cream, morning and evening.',zh:'作为日常面霜，早晚充分涂抹。',ja:'朝晩のデイリークリームとして十分な量を塗布してください。'}
};
const CLINICAL={};
function clinical(ko,en,zh,ja){CLINICAL[ko]={en,zh,ja};}
[
 ['노폐물 세정효과 99.48% 세정','Impurity cleansing: 99.48% removal','污垢清洁效果：去除99.48%','汚れの洗浄効果：99.48%除去'],
 ['메이크업 세정효과 91.59% 세정','Makeup cleansing: 91.59% removal','彩妆清洁效果：去除91.59%','メイク洗浄効果：91.59%除去'],
 ['미세먼지 세정효과 99.55% 세정','Fine dust cleansing: 99.55% removal','细颗粒物清洁效果：去除99.55%','微細粒子の洗浄効果：99.55%除去'],
 ['피부 광채 403.37% 개선','Skin radiance improved by 403.37%','肌肤光泽改善403.37%','肌のツヤが403.37%改善'],
 ['피부 수분량 148.70% 증가','Skin hydration increased by 148.70%','皮肤含水量增加148.70%','皮膚水分量が148.70%増加'],
 ['피부결 10.43% 개선','Skin texture improved by 10.43%','肤理改善10.43%','肌のキメが10.43%改善'],
 ['피부 수분량 136.58% 개선','Skin hydration improved by 136.58%','皮肤含水量改善136.58%','皮膚水分量が136.58%改善'],
 ['피부결 11.84% 개선','Skin texture improved by 11.84%','肤理改善11.84%','肌のキメが11.84%改善'],
 ['피부 자극 테스트: 무자극','Skin irritation test: non-irritating','皮肤刺激测试：无刺激','皮膚刺激テスト：無刺激'],
 ['피부 광채 개선','Improved skin radiance','改善肌肤光泽','肌のツヤ改善'],
 ['외부 자극에 의한 피부 장벽 개선 및 진정효과','Improved skin barrier and soothing effect after external irritation','改善外部刺激后的皮肤屏障并起舒缓作用','外部刺激による皮膚バリアの改善および鎮静効果'],
 ['피부 속탄력 개선','Improved inner skin elasticity','改善肌肤内部弹力','肌内部の弾力改善'],
 ['피부 겉탄력 6.97% 증가','Surface skin elasticity increased by 6.97%','皮肤表层弹力增加6.97%','肌表面の弾力が6.97%増加'],
 ['눈가 주름 9.12% 감소','Eye-area wrinkles decreased by 9.12%','眼周皱纹减少9.12%','目元のシワが9.12%減少'],
 ['크림 병행 사용 시 광채 1회 사용 564.64% 개선','Radiance improved by 564.64% after one use in combination with cream','与面霜配合使用一次后，光泽改善564.64%','クリーム併用で1回使用後のツヤが564.64%改善'],
 ['즉각적 보습량 148.87% 개선','Immediate hydration improved by 148.87%','即时保湿量改善148.87%','即時の保湿量が148.87%改善'],
 ['24시간 보습 지속력 56.65% 개선','24-hour moisture retention improved by 56.65%','24小时保湿持续力改善56.65%','24時間の保湿持続力が56.65%改善'],
 ['피부 투명도 개선','Improved skin clarity','改善肌肤通透感','肌の透明感改善'],
 ['피부 노화 완화 10.19% 개선','Skin aging alleviation improved by 10.19%','皮肤老化缓解改善10.19%','肌の老化緩和が10.19%改善'],
 ['안면 전체 리프팅 4.47% 개선','Overall facial lifting improved by 4.47%','面部整体提拉改善4.47%','顔全体のリフトアップが4.47%改善'],
 ['피부 치밀도 17.15% 증가','Skin density increased by 17.15%','皮肤密度增加17.15%','皮膚密度が17.15%増加'],
 ['24시간 보습 지속력','24-hour moisture retention','24小时保湿持续力','24時間の保湿持続力'],
 ['피부 각질 개선','Improved skin flaking','改善皮肤角质','肌の角質改善']
].forEach(args=>clinical(...args));
