(function($){jQuery(document).ready(function(){
  
  
  var B = jQuery("body"), D = jQuery(document), AP = false, pickers = {}, picker_active = false, pknum = 0;
  
  
  var sexyconfig = function () {
    
    this.defaults = {
      yearRange: [1901,2030],
      lang: 'ru'
    }
    
    this.regional = [];
    
    this.regional['en'] = {
      closeText: 'Done',
      prevText: 'Prev',
      nextText: 'Next',
      currentText: 'Today',
      monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
      weekHeader: 'Wk',
      dateFormat: 'mm/dd/yy',
      firstDay: 0,
      isRTL: false,
      yearSuffix: ''
    }
    
    this.regional['ru'] = {
      closeText: 'ÐŸÑ€Ð¸Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ',
      prevText: 'ÐŸÑ€ÐµÐ´',
      nextText: 'Ð¡Ð»ÐµÐ´',
      currentText: 'Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ',
      monthNames: ['Ð¯Ð½Ð²Ð°Ñ€ÑŒ','Ð¤ÐµÐ²Ñ€Ð°Ð»ÑŒ','ÐœÐ°Ñ€Ñ‚','ÐÐ¿Ñ€ÐµÐ»ÑŒ','ÐœÐ°Ð¹','Ð˜ÑŽÐ½ÑŒ','Ð˜ÑŽÐ»ÑŒ','ÐÐ²Ð³ÑƒÑÑ‚','Ð¡ÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ','ÐžÐºÑ‚ÑÐ±Ñ€ÑŒ','ÐÐ¾ÑÐ±Ñ€ÑŒ','Ð”ÐµÐºÐ°Ð±Ñ€ÑŒ'],
      monthNamesShort: ['Ð¯Ð½Ð²', 'Ð¤ÐµÐ²', 'ÐœÐ°Ñ€', 'ÐÐ¿Ñ€', 'ÐœÐ°Ð¹', 'Ð˜ÑŽÐ½', 'Ð˜ÑŽÐ»', 'ÐÐ²Ð³', 'Ð¡ÐµÐ½', 'ÐžÐºÑ‚', 'ÐÐ¾Ñ', 'Ð”ÐµÐº'],
      dayNames: ['Ð’Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ', 'ÐŸÐ¾Ð½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¸Ðº', 'Ð’Ñ‚Ð¾Ñ€Ð½Ð¸Ðº', 'Ð¡Ñ€ÐµÐ´Ð°', 'Ð§ÐµÑ‚Ð²ÐµÑ€Ð³', 'ÐŸÑÑ‚Ð½Ð¸Ñ†Ð°', 'Ð¡ÑƒÐ±Ð±Ð¾Ñ‚Ð°'],
      dayNamesShort: ['Ð’ÑÐº', 'ÐŸÐ½Ð´', 'Ð’Ñ‚Ñ€', 'Ð¡Ñ€Ð´', 'Ð§Ñ‚Ð²', 'ÐŸÑ‚Ð½', 'Ð¡Ð±Ð±'],
      dayNamesMin: ['Ð’Ñ','ÐŸÐ½','Ð’Ñ‚','Ð¡Ñ€','Ð§Ñ‚','ÐŸÑ‚','Ð¡Ð±'],
      weekHeader: 'ÐÐ´',
      dateFormat: 'dd.mm.yy',
      firstDay: 1,
      isRTL: false,
      yearSuffix: ''
    }
    
    
    this.set = function (_options) {
      var options = jQuery.extend(this.defaults,_options);
      
      if (this.regional[options.lang]) {
        options.regional = this.regional[options.lang];
      }
      return options;
    }

  }
  
  var sexypicker = function () {

    this.attach = function (el, _options) {

      pknum++;
      
      var sp = this;
      var pkid = new Date().getTime()+pknum+Math.floor(Math.random()*1000);
      
      var pck = {
        options: _options,
        pkid: pkid,
        date: new Date(),
        elem: el,
        state: {
          cal_height: 0,
          cal_visible: 0,
          active: false,
          mns: 11,
          drag_month_max: 242,
          cal_visible_p: 1,
          scr_height: 22,
          lih: 22,
          drag_month: false,
          drag_start_m: 0,  
          drag_year: false,
          drag_start_y: 0,
          block_year_click: false,
          scroll_start: 0
        },
        div: {}
      }

      
      pickers[pkid] = pck;
      
      

      pck.elem.bind("focus",function(ev){
        SP.show(pck);
      });
      
      pck.elem.bind("blur",function(ev){
        //SP.hide(pck);
      }); 

      
    }
    
    
    
    
    
    
    
    this.month_mouse_down = function (picker,e,el) {

      AP = picker.pkid;

      if (!picker.state.drag_month) {
        
        document.body.onselectstart = function () { return false }
        document.ondragstart = function () { return false }
        
        var spos = picker.div.months.offset();
        var pos = jQuery(".sexypicker-month-slider-hit",picker.div.main).position();

        var sptop = false;
       
        if (el.hasClass("sexypicker-months")) {         
          sptop = e.pageY-spos.top-(picker.div.month_hit.height()/2);
          picker.div.month_hit.css({top: sptop });
          picker.div.month_slider.css({top: sptop});
          pos = picker.div.month_hit.position();
        }
        
        picker.state.drag_start_m = e.pageY - pos.top;
        var crd = e.pageY - picker.state.drag_start_m;
        
        mousemove_month(picker.pkid,crd);
        
        picker.state.drag_month = true;
      }

      e.preventDefault();
    }
    
    var month_mouse_down = this.month_mouse_down;
    

    this.mousemove_month = function (pkid,coord) {
      var picker = pickers[pkid]
      var tableHeight = picker.state.cal_height;
      var visible = picker.state.cal_visible / tableHeight;
      var scroll = coord / picker.state.drag_month_max * (1-visible);
      var scrollTop = scroll * tableHeight
      if (coord > picker.state.drag_month_max - 1) { coord = picker.state.drag_month_max - 1 }
      if (coord < 1) { coord = 1 }
      
      picker.div.month_hit.css({top:coord});
      picker.div.month_slider.css({top:coord});
      picker.div.days.scrollTop(scrollTop); 
    }
  
    var mousemove_month = this.mousemove_month;
    
    
    
    this.mousemove_year = function (pkid, pageY) {
      
      var pck = pickers[pkid];
      
      var distance = pageY;
      if (distance<0){distance=distance*-1}

      var scr = $(".sexypicker-year-scroll", pck.div.main);
      var coord = (pck.state.scroll_start - pageY);
      if (distance>2) {
        pck.state.block_year_click = true;
      }
      scr.scrollTop(coord);
    
    }
    
    mousemove_year = this.mousemove_year;





    this.month_mouse_up = function (picker,e) {
      picker.state.drag_month = false; 
      picker.state.drag_start_m = 0;
      document.body.onselectstart = null;
      document.ondragstart = null;
      e.preventDefault();
    }
    

    
    D.delegate(".sexypicker-month-slider-hit, .sexypicker-months","mousedown",function(e){
      AP = false;
      var pkid = $(this).parents('.sexypicker').data('pkid');
      var pck = pickers[pkid];
      month_mouse_down(pck,e,$(this));
    });

    
    
    D.delegate("body","mousemove",function(e){
      if (AP && pickers[AP]) {

        var pck = pickers[AP];
        
        if (pck.state.drag_month) {
          pck.state.drag_year = false;
          var crd = e.pageY - pck.state.drag_start_m;
          mousemove_month(AP,crd);
        }

        if (pck.state.drag_year) {  
          pck.state.drag_month = false;
          var crd = e.pageY - pck.state.drag_start_y;
          mousemove_year(AP,crd);
        }
      }
    });




    D.delegate(".sexypicker-months","mouseleave",function(e){
      document.body.onselectstart = null;
      document.ondragstart = null;
    });
    
    

    
    D.delegate(".sexypicker-days, .sexypicker-months", "mousewheel",function(e,delta){ 
      var pkid = $(this).parents(".sexypicker").data("pkid");
      var picker = pickers[pkid];
      var pos = $(".sexypicker-month-slider-hit",picker.div.main).position();
      var crd = pos.top+(11*-delta);
      mousemove_month(pkid, crd);
      return false;
    });
    
    



    D.delegate(".sexypicker-year-slider-hit, .sexypicker-years", "mousedown", function(e){
      
      var pkid = $(this).parents('.sexypicker').data('pkid');
      var pck = pickers[pkid];
      pck.state.drag_month = false;

      if (!pck.state.drag_year) {
        AP = pck.pkid;
        pck.state.block_year_click = false;
        var pos = $(".sexypicker-year-slider-hit", pck.div.main).position();
        pck.state.drag_start_y = e.pageY; 
        pck.state.scroll_start = $(".sexypicker-year-scroll", pck.div.main).scrollTop();
        pck.state.drag_year = true; 
        document.body.onselectstart = function () { return false }
        document.ondragstart = function () { return false }
      }
      e.preventDefault();
    });
    
    
    
    
    D.delegate(".sexypicker-years a","click",function(e){

      var pkid = $(this).parents('.sexypicker').data('pkid');
      var pck = pickers[pkid];
      
      if (!pck.state.block_year_click) {
        var scr = $(".sexypicker-year-scroll", pck.div.main);
        var pos = $(this).position();
        var coord = pos.top - $(".sexypicker-year-slider-hit", pck.div.main).position().top;
        jQuery(".sexypicker-days-table",pck.div.main).html(pck.calend.year(Number($(this).text())));
        scrollheight(pck);
        scr.scrollTop(coord);
      } else {
        block_year_click = false;
      }

      e.preventDefault();
      return false;
    });
    
    
    
    

    D.delegate(".sexypicker-years","mousewheel",function(e,delta){
      var pkid = $(this).parents('.sexypicker').data('pkid');
      var pck = pickers[pkid];
      
      var scr = $(".sexypicker-year-scroll",pck.div.main);
      var scrollTop = scr.scrollTop();

      var nscroll = scrollTop+(delta*-pck.state.lih);
      if (nscroll < pck.state.lih/2) {
        nscroll = pck.state.lih/2;
      } 
      scr.scrollTop(nscroll);
      accurate(pck);
      return false;
    });
    
    
    
    

    D.bind("mouseup",function(){
      if (AP) {
        if (pickers[AP]) {
          var pck = pickers[AP];

          if (pck.state.drag_year) {
            accurate(pck);
          }
          
          pck.state.drag_month = false; 
          pck.state.drag_year = false;
        }
        
        AP = false;
      }

    });
    
    
    
    
    
    this.show = function (pck) {
      if (!pck.state.active) {


        pck.state.D = {
          yy: this.formatDate('yy', pck.date, pck.options.regional)
        }
      
        var offset = pck.elem.offset();
          
        pck.div.main = jQuery('<div>',{
          "id": "sexypicker-"+pck.pkid,
          "class": "sexypicker"
        }).css({
          top: offset.top+pck.elem.innerHeight(),
          left: offset.left
        }).data({'pkid':pck.pkid});
  
        pck.div.days = jQuery('<div>',{
          "id": "sexypicker-days-"+pck.pkid,
          "class": "sexypicker-days"
        });        
        
        pck.div.months = jQuery('<div>',{
          "id": "sexypicker-months-"+pck.pkid,
          "class": "sexypicker-months"
        });
        
        pck.div.years = jQuery('<div>',{
          "id": "sexypicker-years-"+pck.pkid,
          "class": "sexypicker-years"
        });
  
        
        pck.calend = new this.calend(pck.options);
    
        pck.div.days.html('<div id="sexypicker-days-table" class="sexypicker-days-table">'+pck.calend.year(2011)+'</div>');
        
        var ml = '<div id="sexypicker-month-slider" class="sexypicker-month-slider"><div></div></div><ul>';
        for (var m=0;m<=11;m++) {
          ml += '<li><a rel="'+m+'">'+pck.options.regional.monthNames[m]+'</a></li>'
        }
        ml += '</ul><div id="sexypicker-month-slider-hit" class="sexypicker-month-slider-hit"></div>';
        var monthList = ml;
        
        pck.div.months.html(monthList);
        
        var years_slider = '<div id="sexypicker-year-slider" class="sexypicker-year-slider"><div></div></div><div id="sexypicker-year-scroll" class="sexypicker-year-scroll"><ul style="padding: 121px 0px 140px 0px;">';
        for (var y = pck.options.yearRange[0]; y<=pck.options.yearRange[1]; y++) {
          years_slider += '<li><a rel="'+y+'">'+y+'</a></li>';
        }
        years_slider += '</ul></div><div id="sexypicker-year-slider-hit" class="sexypicker-year-slider-hit"><div>';
        
        pck.div.years.html(years_slider);
        
        pck.div.main.
          append(pck.div.days).
          append(pck.div.months).
          append(pck.div.years);
          

        B.append(pck.div.main);
        
        pck.div.month_hit = jQuery(".sexypicker-month-slider-hit", pck.div.main);
        pck.div.month_slider = jQuery(".sexypicker-month-slider", pck.div.main);
        pck.div.months = jQuery(".sexypicker-months", pck.div.main);
        
        this.scrollheight(pck);
        
        pck.state.drag_month_max = pck.div.months.height() - pck.div.month_hit.height();
       
        pck.div.yearcroll = jQuery(".sexypicker-year-scroll",pck.div.main);
  
        pck.state.lih = jQuery(".sexypicker-year-scroll li",pck.div.main).height();
  
        var index = jQuery(".sexypicker-years a[rel='"+pck.state.D.yy+"']",pck.div.main).parent().index();
        
        var accurate = pck.state.lih*index+(pck.state.lih/2);
        pck.div.yearcroll.scrollTop(accurate); 
  
        var sptop = pck.state.D.m*pck.state.lih-(pck.div.month_hit.height()/2);
        pck.div.month_hit.css({top:sptop});
        pck.div.month_slider.css({top:sptop});

        this.mousemove_month(pck.pkid,sptop);

        pck.state.active = true;        
        pck.div.main.show();
      }
    }
    
    show = this.show;
  
    this.hide = function (picker) { 
      picker.state.active = false;
      picker.div.main.hide()
    }
    
    hide = this.hide;
  
  
    this.scrollheight = function (picker) {
      picker.state.cal_height = jQuery(".sexypicker-days-table",picker.div.main).height();
      picker.state.cal_visible = picker.div.days.height();
      picker.state.cal_visible_p = picker.state.cal_visible/picker.state.cal_height;
      picker.state.scr_height = Math.floor(picker.div.months.height()*picker.state.cal_visible_p);
      
      picker.state.drag_month_max = picker.div.months.height() - picker.state.scr_height;
      
      var coord = jQuery(picker.div.month_hit).position().top;
  
      if (coord > picker.state.drag_month_max - 1) { coord = picker.state.drag_month_max - 1 }
      
      
      picker.div.month_hit.css({
        height:picker.state.scr_height,
        top:coord
      });
      
      picker.div.month_slider.css({
        height:picker.state.scr_height,
        top:coord
      });
    }
    
    var scrollheight = this.scrollheight;
  
  
  
    this.accurate = function (picker) {
      var scr = jQuery(".sexypicker-year-scroll", picker.div.main);
      var index = Math.round((scr.scrollTop()/picker.state.lih)-0.5);
      var nyear = Number(jQuery(".sexypicker-years ul li", picker.div.main).eq(index).find("a").text());
      jQuery(".sexypicker-days-table", picker.div.main).html(picker.calend.year(nyear));
      scrollheight(picker);
      var accurate = picker.state.lih*index+(picker.state.lih/2);
      scr.scrollTop(accurate); 
    }
    
    var accurate = this.accurate;
  

  
    this.calend =  function (options) {

      return {

        isLeap: function (year) {
          if(year%4 == 0) { 
            if(year%100 == 0) { 
              if(year%400 == 0) { 
                return true; 
              } 
              else 
                return false; 
            } 
            else 
              return true; 
          } 
          return false; 
        }, 
        

        month: function (index,year) {
          var dim = [31,28,31,30,31,30,31,31,30,31,30,31]
          
          if (this.isLeap(year)) { dim[1]=29 }
          var m = dim[index];
          var day = 1;
          var table = '';
          var mtop = '';
          cropping = (options.regional.monthNames[index].length - start_day);
          if ((start_day > 3 || (cropping>-2 && cropping <2)) && start_day < 8) {
            mtop = 'sexypicker-month-top';
          }
          table += '<h3><b>'+options.regional.monthNames[index]+'</b></h3><table id="sexypicker-month-'+(index+1)+'" class="sexypicker-month sexypicker-month-'+(index+1)+' '+mtop+'"><tbody><tr>';
          for (var i=1;i<start_day;i++){
            table += "<td></td>";
          }
          for (var i=start_day;i<8;i++){
            table += '<td><a rel="'+day+'">'+day+'</a></td>';
            day++
          }
          
          table += "<tr>";
          while (day <= m) {
             for (var i=1;i<=7 && day<=m;i++){
               table += '<td><a rel="'+day+'">'+day+'</a></td>';
               day++
             }
             table += "</tr><tr>";
             start_day=i
          }
          table += "</tr></tbody></table>";
          return table;
        }, 
        
        year: function (date) {
          st = new Date ('January 1, '+date)
          start_day = st.getDay();
          if (start_day==0) {start_day = 7};
          var calend = '';
          for (var f=0;f<=11;f++) {
            calend += this.month(f,date.Y);
          }
          return calend;
        }
      }
    }
  

   
  
  
    this.parseDate = function (format, value, settings) {
      if (format == null || value == null)
        throw 'Invalid arguments';
      value = (typeof value == 'object' ? value.toString() : value + '');
      if (value == '')
        return null;
      var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
      shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
          new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
      var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
      var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
      var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
      var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
      var year = -1;
      var month = -1;
      var day = -1;
      var doy = -1;
      var literal = false;
      // Check whether a format character is doubled
      var lookAhead = function(match) {
        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
        if (matches)
          iFormat++;
        return matches;
      };
      // Extract a number from the string value
      var getNumber = function(match) {
        var isDoubled = lookAhead(match);
        var size = (match == '@' ? 14 : (match == '!' ? 20 :
          (match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
        var digits = new RegExp('^\\d{1,' + size + '}');
        var num = value.substring(iValue).match(digits);
        if (!num)
          throw 'Missing number at position ' + iValue;
        iValue += num[0].length;
        return parseInt(num[0], 10);
      };
      // Extract a name from the string value and convert to an index
      var getName = function(match, shortNames, longNames) {
        var names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
          return [ [k, v] ];
        }).sort(function (a, b) {
          return -(a[1].length - b[1].length);
        });
        var index = -1;
        $.each(names, function (i, pair) {
          var name = pair[1];
          if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
            index = pair[0];
            iValue += name.length;
            return false;
          }
        });
        if (index != -1)
          return index + 1;
        else
          throw 'Unknown name at position ' + iValue;
      };
      // Confirm that a literal character matches the string value
      var checkLiteral = function() {
        if (value.charAt(iValue) != format.charAt(iFormat))
          throw 'Unexpected literal at position ' + iValue;
        iValue++;
      };
      var iValue = 0;
      for (var iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal)
          if (format.charAt(iFormat) == "'" && !lookAhead("'"))
            literal = false;
          else
            checkLiteral();
        else
          switch (format.charAt(iFormat)) {
            case 'd':
              day = getNumber('d');
              break;
            case 'D':
              getName('D', dayNamesShort, dayNames);
              break;
            case 'o':
              doy = getNumber('o');
              break;
            case 'm':
              month = getNumber('m');
              break;
            case 'M':
              month = getName('M', monthNamesShort, monthNames);
              break;
            case 'y':
              year = getNumber('y');
              break;
            case '@':
              var date = new Date(getNumber('@'));
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case '!':
              var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "'":
              if (lookAhead("'"))
                checkLiteral();
              else
                literal = true;
              break;
            default:
              checkLiteral();
          }
      }
      if (year == -1)
        year = new Date().getFullYear();
      else if (year < 100)
        year += new Date().getFullYear() - new Date().getFullYear() % 100 +
          (year <= shortYearCutoff ? 0 : -100);
      if (doy > -1) {
        month = 1;
        day = doy;
        do {
          var dim = this._getDaysInMonth(year, month - 1);
          if (day <= dim)
            break;
          month++;
          day -= dim;
        } while (true);
      }
      var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
      if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
        throw 'Invalid date'; // E.g. 31/02/00
      return date;
    }
    
    parseDate = this.parseDate;
  
  
    this.defaultFormats = {
      ATOM: 'yy-mm-dd',
      COOKIE: 'D, dd M yy',
      ISO_8601: 'yy-mm-dd',
      RFC_822: 'D, d M y',
      RFC_850: 'DD, dd-M-y',
      RFC_1036: 'D, d M y',
      RFC_1123: 'D, d M yy',
      RFC_2822: 'D, d M yy',
      RSS: 'D, d M y',
      TICKS: '!',
      TIMESTAMP: '@',
      W3C: 'yy-mm-dd'
    }
  
    this._ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
      Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),
  
      
    this.formatDate = function (format, date, settings) {
      if (!date)
        return '';
      var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
      var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
      var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
      var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;

      var lookAhead = function(match) {
        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
        if (matches)
          iFormat++;
        return matches;
      };

      var formatNumber = function(match, value, len) {
        var num = '' + value;
        if (lookAhead(match))
          while (num.length < len)
            num = '0' + num;
        return num;
      };

      var formatName = function(match, value, shortNames, longNames) {
        return (lookAhead(match) ? longNames[value] : shortNames[value]);
      };
      var output = '';
      var literal = false;
      if (date)
        for (var iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal)
            if (format.charAt(iFormat) == "'" && !lookAhead("'"))
              literal = false;
            else
              output += format.charAt(iFormat);
          else
            switch (format.charAt(iFormat)) {
              case 'd':
                output += formatNumber('d', date.getDate(), 2);
                break;
              case 'D':
                output += formatName('D', date.getDay(), dayNamesShort, dayNames);
                break;
              case 'o':
                output += formatNumber('o',
                  (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                break;
              case 'm':
                output += formatNumber('m', date.getMonth() + 1, 2);
                break;
              case 'M':
                output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
                break;
              case 'y':
                output += (lookAhead('y') ? date.getFullYear() :
                  (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                break;
              case '@':
                output += date.getTime();
                break;
              case '!':
                output += date.getTime() * 10000 + this._ticksTo1970;
                break;
              case "'":
                if (lookAhead("'"))
                  output += "'";
                else
                  literal = true;
                break;
              default:
                output += format.charAt(iFormat);
            }
        }
      return output;
    }
    
    formatDate = this.formatDate;
    
  }

  var SP = new sexypicker();
  
  jQuery.fn.sexypicker = function(options){
    
    var config = new sexyconfig (options);
    
    var _options = config.set(options);

    return this.each(function(i,el){
      SP.attach(jQuery(el),_options);
    });
    
  }
  
  $.sexypicker = SP;
  
})})(jQuery);




if (!$.event.special.mousewheel) {
  (function($) {
  
  var types = ['DOMMouseScroll', 'mousewheel'];
  
  $.event.special.mousewheel = {
    setup: function() {
      if ( this.addEventListener )
        for ( var i=types.length; i; )
          this.addEventListener( types[--i], handler, false );
      else
        this.onmousewheel = handler;
    },
    
    teardown: function() {
      if ( this.removeEventListener )
        for ( var i=types.length; i; )
          this.removeEventListener( types[--i], handler, false );
      else
        this.onmousewheel = null;
    }
  };
  
  $.fn.extend({
    mousewheel: function(fn) { return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel") },
    unmousewheel: function(fn) { return this.unbind("mousewheel", fn) }
  });
  
  
  var handler = function (event) {
    var args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true;
    event = $.event.fix(event || window.event);
    event.type = "mousewheel";
    if ( event.wheelDelta ) delta = event.wheelDelta/120;
    if ( event.detail     ) delta =-event.detail/3;
    args.unshift(event, delta);
    return $.event.handle.apply(this, args);
  }
  })(jQuery);
}




$(document).ready(function(){
  $(".date").sexypicker({lang:"en"});
  $(".date2").sexypicker({lang:"ru"});
});
