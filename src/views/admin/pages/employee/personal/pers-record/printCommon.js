export default function printCommon () {
  let css = `
    <style>
        *{
          padding:0;
          margin:0;
        }
        img {
          border: 0;
          outline-style: none;
          display: block
        }
        td {
          text-align: center;
          font-size: 12px;
          height: 30px;
        }
        .h1 {
          font-size: 15px;
          font-weight: normal;
          text-align: center;
          line-height: 30px;
        }
        .h2 {
          font-size: 13px;
          background:#d9d9d9;
          text-align: left;
          line-height:30px;
        }
    </style>
  `
  return css
}
