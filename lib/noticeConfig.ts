export interface NoticeSource {
  key: string;
  name: string;
  shortName: string;
  color: string;      // tailwind color name
  noticeUrl: string;  // 사용자에게 보여줄 공식 URL
  fetchUrl: string;   // 실제 크롤링 URL
  baseUrl: string;    // 상대 링크 해결용 베이스 URL
  category: string;
}

export interface Notice {
  id: string;
  source: string;
  sourceName: string;
  shortName: string;
  color: string;
  category: string;
  title: string;
  link: string;
  date?: string;
}

export interface NoticeResult {
  source: string;
  status: 'ok' | 'error';
  notices: Notice[];
  directUrl: string;
  sourceName: string;
}

export const NOTICE_SOURCES: NoticeSource[] = [
  {
    key: 'koiha',
    name: '의료기관평가인증원',
    shortName: 'KOIHA',
    color: 'rose',
    noticeUrl: 'https://www.koiha.or.kr/web/kr/notice/noticeList.do',
    fetchUrl: 'https://www.koiha.or.kr/web/kr/notice/noticeList.do',
    baseUrl: 'https://www.koiha.or.kr',
    category: '인증',
  },
  {
    key: 'mohw',
    name: '보건복지부',
    shortName: '복지부',
    color: 'blue',
    noticeUrl: 'https://www.mohw.go.kr/board.es?mid=a10501010100&bid=0003',
    fetchUrl: 'https://www.mohw.go.kr/board.es?mid=a10501010100&bid=0003',
    baseUrl: 'https://www.mohw.go.kr',
    category: '정책',
  },
  {
    key: 'hira',
    name: '건강보험심사평가원',
    shortName: 'HIRA',
    color: 'green',
    noticeUrl: 'https://www.hira.or.kr/bbsDummy.do?pgmid=HIRAA020002000100',
    fetchUrl: 'https://www.hira.or.kr/bbsDummy.do?pgmid=HIRAA020002000100',
    baseUrl: 'https://www.hira.or.kr',
    category: '수가',
  },
  {
    key: 'kha',
    name: '대한병원협회',
    shortName: '병원협회',
    color: 'purple',
    noticeUrl: 'https://kha.or.kr/kha_home/notice_list.do?mode=list&article.offset=0',
    fetchUrl: 'https://kha.or.kr/kha_home/notice_list.do?mode=list&article.offset=0',
    baseUrl: 'https://kha.or.kr',
    category: '협회',
  },
  {
    key: 'lmha',
    name: '대한요양병원협회',
    shortName: '요양협회',
    color: 'orange',
    noticeUrl: 'https://www.lmha.or.kr/bbs/board.php?tbl=bbs_notice',
    fetchUrl: 'https://www.lmha.or.kr/bbs/board.php?tbl=bbs_notice',
    baseUrl: 'https://www.lmha.or.kr',
    category: '요양',
  },
];
