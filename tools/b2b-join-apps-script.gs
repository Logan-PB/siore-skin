/**
 * 시오레 B2B 가입 신청 접수 (약국 파트너 안내 페이지 → 시트·드라이브·메일)
 * 1) 처음 한 번 setup 실행 → 시트와 서류 폴더가 만들어집니다.
 * 2) 배포 > 새 배포 > 웹 앱 (실행: 나, 액세스: 모든 사용자) 주소를 페이지에 연결합니다.
 * 슬랙 알림: 스크립트 속성 SLACK_BOT_TOKEN(로건 비서 봇 xoxb-)을 넣으면 DM으로 옵니다. testSlack 으로 확인.
 */
const MAX_FILES = 4;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

function setup() {
  const p = PropertiesService.getScriptProperties();
  if (!p.getProperty('SHEET')) {
    const ss = SpreadsheetApp.create('시오레 B2B 가입 신청 접수');
    const sh = ss.getActiveSheet();
    sh.setName('접수');
    sh.appendRow(['접수시각', '약국명', '대표약사', 'B2B몰 아이디', '휴대폰', '사업자등록번호', '전달사항', '서류 폴더', '처리상태', '유입 페이지']);
    sh.setFrozenRows(1);
    sh.getRange('1:1').setFontWeight('bold').setBackground('#FFF1EA');
    p.setProperty('SHEET', ss.getId());
  }
  if (!p.getProperty('FOLDER')) {
    p.setProperty('FOLDER', DriveApp.createFolder('시오레 B2B 가입 서류').getId());
  }
  p.setProperty('NOTIFY', Session.getEffectiveUser().getEmail());
  Logger.log('시트: ' + SpreadsheetApp.openById(p.getProperty('SHEET')).getUrl());
  Logger.log('서류 폴더: ' + DriveApp.getFolderById(p.getProperty('FOLDER')).getUrl());
}

function clean_(v, max) {
  let s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // 시트 수식 주입 방지
  return s;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const p = PropertiesService.getScriptProperties();
    const r = {
      pharmacy: clean_(d.pharmacy, 60), owner: clean_(d.owner, 30), mallId: clean_(d.mallId, 20),
      phone: clean_(d.phone, 20), bizno: clean_(d.bizno, 20), memo: clean_(d.memo, 300), page: clean_(d.page, 200)
    };
    if (!r.pharmacy || !r.owner || !r.mallId || !r.phone || !r.bizno || d.agree !== 'Y') {
      return ContentService.createTextOutput('missing');
    }
    const now = new Date();
    const stamp = Utilities.formatDate(now, 'Asia/Seoul', 'yyMMdd_HHmm');
    const folder = DriveApp.getFolderById(p.getProperty('FOLDER')).createFolder(stamp + '_' + r.pharmacy.replace(/^'/, '') + '_' + r.mallId.replace(/^'/, ''));
    (d.files || []).slice(0, MAX_FILES).forEach(function (f, i) {
      if (OK_TYPES.indexOf(f.type) < 0) return;
      const bytes = Utilities.base64Decode(f.data);
      if (bytes.length > 15 * 1024 * 1024) return;
      folder.createFile(Utilities.newBlob(bytes, f.type, (i + 1) + '_' + String(f.name || 'doc').slice(0, 60)));
    });
    const sh = SpreadsheetApp.openById(p.getProperty('SHEET')).getSheetByName('접수');
    if (!sh.getRange(1, 11).getValue()) sh.getRange(1, 11).setValue('승인 문자').setFontWeight('bold').setBackground('#FFF1EA');
    sh.appendRow([
      Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm'), r.pharmacy, r.owner, r.mallId, r.phone, r.bizno, r.memo, folder.getUrl(), '승인 대기', r.page,
      '=HYPERLINK("' + smsUrl_(r) + '","📩 문자 보내기")'
    ]);
    const to = p.getProperty('NOTIFY');
    if (to) {
      MailApp.sendEmail({
        to: to,
        subject: '[시오레 B2B 가입신청] ' + r.pharmacy + ' · 몰 아이디 ' + r.mallId,
        htmlBody: '<b>' + r.pharmacy + '</b> ' + r.owner + ' 약사님<br>B2B몰 아이디: <b>' + r.mallId + '</b><br>휴대폰: ' + r.phone +
          '<br>사업자번호: ' + r.bizno + (r.memo ? '<br>전달사항: ' + r.memo : '') +
          '<br><br>서류: <a href="' + folder.getUrl() + '">드라이브 폴더 열기</a><br>접수 시트: <a href="' + SpreadsheetApp.openById(p.getProperty('SHEET')).getUrl() + '">시트 열기</a>' +
          '<br><br>→ B2B몰 관리자에서 등급 승인 후, <a href="' + smsUrl_(r) + '">📩 승인 안내 문자 보내기</a>'
      });
    }
    notifySlack_(r, folder.getUrl());
    return ContentService.createTextOutput('ok');
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput('error');
  } finally {
    lock.releaseLock();
  }
}

const SMS_PAGE = 'https://logan-pb.github.io/siore-skin/guides/sms.html';
function smsUrl_(r) {
  return SMS_PAGE + '?to=' + encodeURIComponent(String(r.phone).replace(/[^0-9]/g, '')) +
    '&ph=' + encodeURIComponent(String(r.pharmacy).replace(/^'/, '')) + '&ow=' + encodeURIComponent(String(r.owner).replace(/^'/, ''));
}

const SLACK_USER_ID = 'U0A8XGSDQQ3'; // 한창훈(Logan) — 로건 비서 봇 DM으로 알림

function notifySlack_(r, url) {
  const p = PropertiesService.getScriptProperties();
  const sheetUrl = p.getProperty('SHEET') ? SpreadsheetApp.openById(p.getProperty('SHEET')).getUrl() : '';
  const text = ':tada: *시오레 B2B 가입신청* 접수\n' +
    '• 약국: *' + r.pharmacy + '* (' + r.owner + ' 약사님)\n' +
    '• 몰 아이디: `' + r.mallId + '`\n• 휴대폰: ' + r.phone + '\n• 사업자번호: ' + r.bizno +
    (r.memo ? '\n• 전달사항: ' + r.memo : '') +
    '\n<' + url + '|서류 폴더>' + (sheetUrl ? ' · <' + sheetUrl + '|접수 시트>' : '') +
    '\n→ 등업 후 <' + smsUrl_(r) + '|📩 승인 안내 문자 보내기>';
  try {
    const token = p.getProperty('SLACK_BOT_TOKEN');
    if (token) {
      const res = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
        method: 'post', contentType: 'application/json; charset=utf-8', muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + token },
        payload: JSON.stringify({ channel: p.getProperty('SLACK_CHANNEL') || SLACK_USER_ID, text: text })
      });
      const j = JSON.parse(res.getContentText() || '{}');
      if (!j.ok) console.error('slack: ' + (j.error || res.getResponseCode()));
      return j.ok;
    }
    const hook = p.getProperty('SLACK_WEBHOOK');
    if (hook) {
      UrlFetchApp.fetch(hook, { method: 'post', contentType: 'application/json', muteHttpExceptions: true, payload: JSON.stringify({ text: text }) });
      return true;
    }
  } catch (e) { console.error(e); }
  return false; // 슬랙 실패해도 시트·메일은 이미 처리됨
}

/** 슬랙 연결 확인용: 실행하면 로건 비서 DM으로 테스트 알림 1건 */
function testSlack() {
  const ok = notifySlack_({ pharmacy: '테스트약국', owner: '홍길동', mallId: 'test1234', phone: '010-0000-0000', bizno: '000-00-00000', memo: '연결 테스트입니다' }, 'https://drive.google.com');
  Logger.log(ok ? '슬랙 전송 성공' : '슬랙 전송 실패 — SLACK_BOT_TOKEN 확인');
}

function doGet() {
  return ContentService.createTextOutput('SIORE B2B join endpoint');
}
