jQuery.fn.table2CSV=function(e){e=jQuery.extend({separator:",",header:[],headerSelector:"th",columnSelector:"td",delivery:"popup",transform_gt_lt:!0},e);var t=[],n=e.header.length,r=[];if(n>0)for(var i=0;i<n;i++)r[r.length]=s(e.header[i]);else $(this).filter(":visible").find(e.headerSelector).each(function(){"none"!=$(this).css("display")&&(r[r.length]=s($(this).html()))});if(h(r),$(this).find("tr").each(function(){var t=[];$(this).filter(":visible").find(e.columnSelector).each(function(){"none"!=$(this).css("display")&&(t[t.length]=s($(this).html()))}),h(t)}),"popup"==e.delivery){var o=t.join("\n");return e.transform_gt_lt&&(o=d(o)),l=o,(c=window.open("","csv","height=400,width=600")).document.write("<html><head><title>CSV</title>"),c.document.write("</head><body >"),c.document.write('<textArea cols=70 rows=15 wrap="off" >'),c.document.write(l),c.document.write("</textArea>"),c.document.write("</body></html>"),c.document.close(),!0}if("download"==e.delivery){o=t.join("\n");e.transform_gt_lt&&(o=d(o));var a="data:text/csv;charset=utf8,"+encodeURIComponent(o);return window.open(a),!0}var l,c;o=t.join("\n");return e.transform_gt_lt&&(o=d(o)),o;function d(e){var t=new RegExp(/&gt;/g);e=e.replace(t,">"),t=new RegExp(/&lt;/g);return e=e.replace(t,"<")}function h(n){var r=n.join("");if(n.length>0&&""!=r){var i=n.join(e.separator);t[t.length]=i}}function s(e){var t=new RegExp(/["]/g),n=e.replace(t,"“");t=new RegExp(/\<[^\<]+\>/g);return""==(n=(n=n.replace(t,"")).replace(/&nbsp;/gi," "))?"":'"'+n.trim()+'"'}};