//Export2Excel.js 
 
/* eslint-disable */
require("script-loader!file-saver")
import XLSX from 'xlsx-style'
// import XLSX from "xlsx-style"
 
export function generateArray(table) {
  var tablestyle = []
  var out = []
  var rows = table.querySelectorAll("tr")
  var ranges = []
  for (var R = 0; R < rows.length; ++R) {
    var outRow = []
    var row = rows[R]
    var styles = []
    var columns = row.querySelectorAll("td")
    // console.log("c",columns)
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C]
      // console.log($(cell))
      var colspan = cell.getAttribute("colspan")
      var rowspan = cell.getAttribute("rowspan")
      let style = {
        font:{

        },
        alignment:{

        },
        fill:{

        },
        border:{

        }
      }
      if(cell.style.fontSize){
        style.font.sz = parseInt(cell.style.fontSize)*0.7
      }else{
        if($(cell).hasClass('dataready')){
          style.font.sz = 8
        }else{
          style.font.sz = 11
        }
      }
      if(cell.style.color){
        style.font.color ={
          rgb: colorRGBtoHex(cell.style.color)
        }
      }else{
        style.font.color =  {}
      }
      if(cell.style.fontFamily){
        style.font.name = cell.style.fontFamily
      }else{
        style.font.name =  'Microsoft YaHei'
      }
      if(cell.style.fontWeight){
        style.font.bold = true
      }else{
        style.font.bold =  false
      }
      // if(cell.style.textDecoration){
      //   style.font.underline = true
      // }else{
      //   style.font.underline =  false
      // }
      // if(cell.style.fontStyle){
      //   style.font.italic = true
      // }else{
      //   style.font.italic =  false
      // }
      if($(cell).attr('align')){
        style.alignment.horizontal = $(cell).attr('align')
      }else{
        style.alignment.horizontal =  ''
      }
      if($(cell).attr('valign')){
        if( $(cell).attr('valign')=='middle'){
          style.alignment.vertical = 'center'
        }else{
          style.alignment.vertical = $(cell).attr('valign')
        }
        
      }else{
        style.alignment.vertical =  ''
      }
      
      if(cell.style.backgroundColor){
        style.fill.bgColor = {
          indexed:64 
        }
        style.fill.fgColor = {
          rgb:colorRGBtoHex(cell.style.backgroundColor)
        }
      }else{
        style.fill.bgColor =  {}
        style.fill.fgColor = {}
      }
      // console.log($(cell))
      // console.log($(cell).css('border-top-style')!=='none')
      // console.log($(cell).css('border-bottom'))
     if($(cell).css('border-right-style')!=='none'&&$(cell).css('border-right-style')){
        style.border.right = {
          style:'thin',
          color:{
            rgb:colorRGBtoHex($(cell).css('border-right-color'))
          }
        }
         
      }else   if($(cell).css('border-left-style')!=='none'&&$(cell).css('border-left-style')){
        style.border.left = {
          style:'thin',
          color:{
            rgb:colorRGBtoHex($(cell).css('border-left-color'))
          }
        }
         
      }
     
      if($(cell).css('border-top-style')!=='none'&&$(cell).css('border-top-style')){
        style.border.top = {
          style:'thin',
          color:{
            rgb:colorRGBtoHex($(cell).css('border-top-color'))
          }
        }
         
      }else  if($(cell).css('border-bottom-style')!=='none'&&$(cell).css('border-bottom-style')){
        style.border.bottom = {
          style:'thin',
          color:{
            rgb:colorRGBtoHex($(cell).css('border-bottom-color'))
          }
        }
         
      }
      if($(cell).hasClass('bordertop')){
        style.border.top = {
          style:'thin',
          color:{
            rgb:'black'
          }
        }
      }
      if($(cell).hasClass('borderleft')){
        style.border.left = {
          style:'thin',
          color:{
            rgb:'black'
          }
        }
      }
      if($(cell).hasClass('borderright')){
        style.border.right = {
          style:'thin',
          color:{
            rgb:'black'
          }
        }
      }
      if($(cell).hasClass('borderbottom')){
        style.border.bottom = {
          style:'thin',
          color:{
            rgb:'black'
          }
        }
      }
      // tablestyle.push(style)
      if($(cell).children().length>0){
        
        var cellValue = $(cell).find('input').val()
      }else{
        var cellValue = cell.innerText
      }
  
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue
 
      //Skip ranges
      ranges.forEach(function(range) {
        if (
          R >= range.s.r &&
          R <= range.e.r &&
          outRow.length >= range.s.c &&
          outRow.length <= range.e.c
        ) {
          // console.log(range.e.c)
          // console.log(range.s.c)
          // console.log(outRow)
          for (var i1 = 0; i1 <= range.e.c - range.s.c; ++i1){outRow.push(null),styles.push(style)}
        }
      })
 
      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        })
      }
 
      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null)
      styles.push(style !== "" ? style : null)
      //Handle Colspan
      if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null)
      if (colspan) for (var k = 0; k < colspan - 1; ++k) styles.push(style)
    }
    // console.log(outRow)
    tablestyle.push(styles)
    out.push(outRow)
  }
  // console.log(tablestyle);
  // console.log(ranges)
  return [out, ranges,tablestyle]
}
function colorRGBtoHex(color) {
  var rgb = color.split(',');
  var r = parseInt(rgb[0].split('(')[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(')')[0]);
  var hex =((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}
function datenum(v, date1904) {
  if (date1904) v += 1462
  var epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}
 
function sheet_from_array_of_arrays(data, opts) {
  var ws = {}
  // console.log(data)
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  }

  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      // console.log(data)
      var cell = {
        v: data[R][C]
      }
      if(cell.v == null) cell.v=''
      if (cell.v == null) continue
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      })
 
      if (typeof cell.v === "number") cell.t = "n"
      else if (typeof cell.v === "boolean") cell.t = "b"
      else if (cell.v instanceof Date) {
        cell.t = "n"
        cell.z = XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else cell.t = "s"
 
      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range)
  return ws
}
 
function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}
 
function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
 
export function export_table_to_excel(theTable,width) {
  // var theTable = document.getElementById(id)
  var oo = generateArray(theTable)
  // console.log(width)
  // console.log('oo',oo)
  var ranges = oo[1]
  /* original data */
  // oo[0][1] = [null,null,null,null,null,null,'2132131',null,null,'222',null,null,'111',null,null]
  var data = oo[0]
  var style = oo[2]
  var ws_name = "SheetJS"
  
  var wb = new Workbook(),

    ws = sheet_from_array_of_arrays(data,style)
  // console.log(ranges)
  /* add ranges to worksheet */
  ws['!cols'] = width;
  ws["!merges"] = ranges
//  ws["!merges"] = [{e:{
//  r:0,c:0
//  },s:{
// r:1,
// c:1
//  }}]
//  console.log(ws)
  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws
  // console.log(wb.SheetJS)
  // wb.Sheets.SheetJS.C6.s={
  //   font:{
  //       bold:true,
  //   },
  //   fill:{
  //     fgColor:{
  //       rgb:'000'
  //     }
  //   }
  // }
  // console.log(wb)
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: false,
    type: "binary"
  })
 
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    "自定义报表.xlsx"
  )
   
}
 
 
 //导出的另外一种
//主要修改此函数内的方法
 
export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  sheetname,
  filename,
  merges = [],
  autoWidth = true,
  bookType = "xlsx"
} = {}) {
  /* original data */
  filename = filename || "excel-list"
  data = [...data]
  var ws_name = sheetname
  var wb = new Workbook(),
    ws = []
  for (var i = 0; i < header.length; i++) {
    data[i].unshift(header[i]);
  }
  let style = {
    font: {
      // name: "宋体",
      // sz: 18,
      color: { rgb: "red" },
      bold: true
      // italic: false,
      // underline: false
    },
    alignment: {
      horizontal: "center",
      vertical: "center"
    },
  };
  let style1 = {
    alignment: {
      horizontal: "center",
      vertical: "center"
    },
  };
  let style2 = {
    font: {
      color:{
        rgb:'FF0000'
      },
    },
    alignment: {
      horizontal: "center",
      vertical: "center"
    },
  };
  // data.unshift(header)
 
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }
 
 
  for (var j = 0; j < header.length; j++) {
    ws.push(sheet_from_array_of_arrays(data[j]))
  }
 
  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = []
    merges.forEach(item => {
      ws["!merges"].push(XLSX.utils.decode_range(item))
    })
  }
  // console.log("width", autoWidth)
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    var colWidth = []
    for (var k = 0; k < header.length; k++) {
      colWidth.push(
        data[k].map(row =>
          row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
              return {
                wch: 10
              }
            } else if (val.toString().charCodeAt(0) > 255) {
              /*再判断是否为中文*/
              return {
                wch: val.toString().length * 2
              }
            } else {
              return {
                wch: val.toString().length
              }
            }
          })
        )
      )
    }
    let arr = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
      "N1",
      "O1",
      "P1",
      "Q1",
      "R1",
      "S1",
      "T1",
      "U1",
      "V1",
      "W1",
      "X1",
      "Y1",
      "Z1"
    ];
    /*以第一行为初始值*/
    let result = []
    for (var k = 0; k < colWidth.length; k++) {
      result[k] = colWidth[k][0]
      for (let i = 1; i < colWidth[k].length; i++) {
        for (let j = 0; j < colWidth[k][i].length; j++) {
          if (result[k][j]["wch"] < colWidth[k][i][j]["wch"]) {
            result[k][j]["wch"] = colWidth[k][i][j]["wch"]
          }
        }
      }
    }
    // 分别给sheet表设置宽度
    for (var l = 0; l < result.length; l++) {
      Object.keys(ws[l]).forEach(function(key){
        if(typeof(ws[l][key]) == 'object'){
          ws[l][key].s =  style1
      console.log(ws[l][key])
        }
   });
      ws[l]["!cols"] = result[l]
      for (var i = 0; i < header[0].length; i++) {
        if(ws[l][arr[i]]){
          ws[l][arr[i]].s = style;
        }
      
      }
    }
  }
 
  /* add worksheet to workbook */
  for (var k = 0; k < header.length; k++) {
    wb.SheetNames.push(ws_name[k])
    wb.Sheets[ws_name[k]] = ws[k];
  }
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  var dataInfo = wb.Sheets[wb.SheetNames[0]];
  const borderAll = {
    //单元格外侧框线
    top: {
      style: "thin"
    },
    bottom: {
      style: "thin"
    },
    left: {
      style: "thin"
    },
    right: {
      style: "thin"
    }
  };
 
  // for (var i in dataInfo) {
  //   if (i == '!ref' || i == '!merges' || i == '!cols' || i == 'A1') {

  //   } else {
  //     dataInfo[i + ''].s = style1
  //   }
  // }

  // 标题行

  // arr.some(function(v) {
  //   let a = merges[0].split(":");
  //   if (v == a[1]) {
  //     dataInfo[v].s = {};
  //     return true;
  //   } else {
  //     dataInfo[v].s = {};
  //   }
  // });
  //设置主标题样式
 

  // dataInfo["B1"].s = style;
  // dataInfo["A1"].s = style;

  // excel标题样式

 wb.SheetNames.pop();
 wb.SheetNames.pop();
//  console.log(wb)
  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary"
  })
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    `${filename}.${bookType}`
  )
  
}
