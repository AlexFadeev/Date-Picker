/* Date Picker v0.1.2
 * http://alexfadeev.com/datepicker/
 *
 * Licensed under the LGPLv3 licenses.
 * http://alexfadeev.com/datepicker/license/ & LICENSE.txt
 *
 * 2011, Alex Fadeev
 * Date: Thu Sep 01 14:16:56 2011 -0400
 * 
 * Requires: jQuery, jQuery UI
 */

 


(function($){
	$.fn.datePicker = function(options) {
		
		//var element = $(this);
	
		//Настройки отображения
		var options = $.extend({
			monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
			dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
			dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			dayLocale: 1,
			loadDateBuffer: 2,
			loadMonthBuffer: 12,
			loadYearBuffer: 10,
			daysInWeeks: 7,
			nameGeneralClass: 'datePickerContent',
			heightPicker: 400,
			widthPicker: 400,
			activeZoneHeight: 30,
			heightDateCell: 28,
			widthDateCell: 28,
			dateCellBorderSize: 2,
			dateCellPadding: 1,
			heightMonthCell: 25,
			widthMonthCell: 80,
			heightYearCell: 25,
			widthYearCell: 50,
			clearance: 5000
			
		}, options);
		var monthCountPrepare = 0;
		var dateHeightSize = monthHeightSize = yearHeightSize = 0;
		var dataSet = [];
		var activeMonthIndex;
		var startPoint = 0;
		var endPoint = 0;
		var dateSummaryPrevHeight = 0;
		var enableNewMonth = false;
		var oldActiveMonth;
		
		// Настройки даты
		var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);
		var	year = today.getFullYear(),
			month = today.getMonth(),
			day = today.getDate(),
			isLong = !(today.getFullYear() % 4)
			
		// Темплейты
		var nameGeneralClass = '.' + options.nameGeneralClass;
		var generalElement = '<div class="'+ options.nameGeneralClass +'"><div class="redLine"></div><div class="dateBorder"></div><div class="monthBorder"></div><div class="yearBorder"></div></div><div class="datePickerTempInformation"><div class="text1"></div><div class="text2"></div><div class="text3"></div><div class="text4"></div><div class="text5"></div><div class="text6"></div><div class="text7"></div><div class="text8"></div><div class="text9"></div><div class="text10"></div><div class="text11"></div><div class="text12"></div><div class="text13"></div></div>';
		var dateRollBlock = '.dateRoll ul.rollWall';
		var monthRollBlock = '.monthRoll ul.rollWall';
		var yearRollBlock = '.yearRoll ul.rollWall';
		
		
		
		
		
		
		return this.each(function() {
			
			$(this).parent().append(generalElement);
			
			
			$(this).focusin(function(){
				if(!($(nameGeneralClass).hasClass('included'))) {
					//$('.datePickerContent *').disableSelection();
					$(nameGeneralClass).addClass('included visible');
					buildDatePicker(year, month, day);
					activateDatePicker();
					//getMonthData([year, month]);
					//$.when(activateDatePicker()).then(centeringRolls());
				}
				if(!($(nameGeneralClass).hasClass('visible'))){
					$(nameGeneralClass).addClass('visible');				
				}
			});
			$(this).focusout(function(){
				if($(nameGeneralClass).hasClass('included')) {
					//$(nameGeneralClass).removeClass('visible');
				}
			});
		});
			
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////			Первичное построение календаря			///////////////////
		///////////////////////////////////////////////////////////////////////////////////////
		
		// The function generating the data in table months. Returns an array of months.
		function getMonthData (innerCalculateDate, count, onlyThis) {
			var monthData = [];
			
			if(!count) {
				var count = options.loadDateBuffer * 2 + 1;
			}

			function getPoints(indexNumber, height) {
				if( indexNumber == 0) {
					var startPoint = 0;
				} else {
					var startPoint = monthData[indexNumber - 1].bottomPoint + 1;
				}
				var middlePoint = startPoint + height / 2;
				var endPoint = startPoint + height;
				
				return points = [startPoint, middlePoint, endPoint];
			}
			
			for (indexNumber = 0; indexNumber < count; indexNumber++) {
				if(!onlyThis) {
					var calcMonth = innerCalculateDate[1] + (indexNumber - options.loadDateBuffer);
				} else {
					var calcMonth = innerCalculateDate[1];
				}
				var date = dateCorrection([innerCalculateDate[0], calcMonth]);
				var monthTable = getMonthTable(date[0], date[1], indexNumber);
				var points = getPoints(indexNumber, monthTable[2]);
				var active = false;
				
				monthData[indexNumber] = {
					year: date[0],						// 0
					month: date[1],						// 1
					height: monthTable[2],    // 2
					count: monthTable[1],			// 3
					topPoint: points[0],			// 4
					middlePoint: points[1],		// 5
					bottomPoint: points[2], 	// 6
					data: monthTable[0],			// 7
					activity: active					// 8
				}
			}
			return monthData;
		}
		
		// Correction of date. For example: if the input data are given [2011, 13], then the output is [2012, 0]
		function dateCorrection (innerDate) {
			var innerYear = innerDate[0];
			var innerMonth = innerDate[1];
			var outMonth, outYear;
			var outDate = [];
			
			if(innerMonth >= 12) {
				outMonth = innerMonth - 12;
				outYear = innerYear + 1;
			} else if(innerMonth < 0) {
				outMonth = innerMonth + 12;
				outYear = innerYear - 1;
			} else {
				outMonth = innerMonth;
				outYear = innerYear;
			}
			
			return outDate = [outYear, outMonth];
		}
		

		function getDateRoll (year, month) {
			$('.'+ options.nameGeneralClass).append('<div class="dateRoll roll"><ul class="rollWall"><li class="clearance"></li></ul></div>');
			for (i = 0; i < (options.loadDateBuffer * 2 + 1); i++) {
				$(dateRollBlock).append(dataSet[i].data);
			}
			zeroPositioning([year, month], 'date');
		}
		

		function getMonthRoll (year, month) {
			$('.'+ options.nameGeneralClass).append('<div class="monthRoll roll"><ul class="rollWall"></ul></div>');
			$('.monthRoll ul.rollWall').html(getMonthList(year, month));
			
			zeroPositioning([year, month], 'month');
		}
		

		function getYearRoll (year) {
			$('.'+ options.nameGeneralClass).append('<div class="yearRoll roll"><ul class="rollWall"></ul></div>');
			$('.yearRoll ul.rollWall').html(getYearList(year));
			
			zeroPositioning([year, month], 'year');
		}
		

		function getMonthList (year, month) {
			var generatedMonthList = '';
			var preMonths = month - options.loadMonthBuffer;
			var postMonths = month + options.loadMonthBuffer;
			
			for(i = preMonths; i <= postMonths; i++){
				if(i > 11) {
					insertMonth = i - 12;
					insertYear = year + 1;
				} else if(i < 0) {
					insertMonth = i + 12;
					insertYear = year - 1;
				} else {
					insertMonth = i;
					insertYear = year;
				}
				
				var currentMonth = isCurrent(insertYear, insertMonth, today.getDate());
				
				generatedMonthList += '<li data-year="'+ insertYear +'" data-month="'+ insertMonth +'" class="monthItem '+ currentMonth +'">'+options.monthNames[insertMonth]+'</li>';
			}
			return generatedMonthList;
		}
		

		function getYearList(year) {
			var generatedYearList = '';
			var preYears = year - options.loadYearBuffer;
			var postYears = year + options.loadYearBuffer;
			var today = new Date();
			
			
			for(i = preYears; i <= postYears; i++){
				var currentYear = isCurrent(i, today.getMonth(), today.getDate());
				
				generatedYearList += '<li data-year="'+ i +'" class="yearItem">'+ i +'</li>';
			}
			return generatedYearList;
		}
		
		
		function getMonthTable (year, month, index) {
			var generatedMonthTable = '';
			var calculatedDate = new Date(year,month);
			var calculatedIsLong = !(calculatedDate.getFullYear() % 4);
			var monthLimits = [31, calculatedIsLong ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var count = 0;
			var day = calculatedDate.getDay();
			var oneMonthData = [];

			// Вставка пустых ячеек
			function insertEmptySquare(start, limit) {
				start > 1 ? start += 1 : start = 1;
				for(i = start; i < limit; i++){
					generatedMonthTable += '<li class="empty"></li>';
					count++;
				}
			}
			
			function isWeekend(year, month, day) {
				calculatedDate = new Date(year, month, day);
				day = calculatedDate.getDay();
				if(day-1 > 4 || day == 0){ 
					return 'weekend';
				} else {
					return '';
				}
			}
			

			for(d = 1; d < 8; d++) {
				var weekend = d > 5 ? 'weekend' : '';
				if(d == options.daysInWeeks) d = 0
				generatedMonthTable += '<li class="dayName '+weekend+'">'+ options.dayNamesShort[d] +'</li>';
				count++;
				
				if(d == 0) break;
			}
			
			if(day < options.daysInWeeks ){
				if(day == 0) day = options.daysInWeeks
				insertEmptySquare(1, day);
			}
			
			for(i = 1; i <= monthLimits[month]; i++){
				var weekend = '';
				var weekend = isWeekend(year,month,i);
				var currentDate = isCurrent(year,month,i);
				
				generatedMonthTable += '<li data-date="' + i + '" class="'+ currentDate +' '+isWeekend(year,month,i)+'">'+ i +'</li>';
				count++;
			}
			
			var emptyCount = count;
			for(c = 0; c <= Math.ceil(count / options.daysInWeeks); c++){
				emptyCount -= options.daysInWeeks
					if(emptyCount == 0) {
						break;
					} else if(emptyCount < options.daysInWeeks) {
						insertEmptySquare(0, (options.daysInWeeks - emptyCount + 1));
						break
					}
			}
			
			var height = Math.ceil(count / options.daysInWeeks) * (options.heightDateCell+1) + 25 + options.dateCellPadding*2 + options.dateCellBorderSize*2;
			
			var monthItem = ('<li data-month="' + (month+1) + '" data-year="' + year + '" data-height="' + height + '" class="oneMonth"><h6>' + options.monthNames[month] + '</h6><span>' + year + '</span><ul class="month mb' + Math.ceil(count / options.daysInWeeks) +'r">' + generatedMonthTable + '</ul></li>');
			
			return oneMonthData = [monthItem, count, height];
		}
		

		function isCurrent(year, month, day) {
			var result = '';
			var eachResult = [false, false, false];
			var todayDate = [today.getFullYear(), today.getMonth(), today.getDate()];
			var calcDate = [year, month, day];
			
			for( r = 0; r < 3; r++){
				eachResult[r] = (todayDate[r] == calcDate[r]);
				if(calcDate[r] == undefined) {
					eachResult[r] = true;
				}
			}
			
			if(eachResult[0] == true && eachResult[1] == true && eachResult[2] == true) {
				result = 'current';
			}
			return result;
		}
		
		
		
		
		// Позиционирование колонок
		function zeroPositioning(currentData, type) {
			var positionPoint = 0;
			var indexMonth = options.loadDateBuffer;
			
			if(type == 'date') {
				positionPoint = dataSet[indexMonth].middlePoint - (options.heightPicker / 2)  + options.clearance;
				$(dateRollBlock).css('top', -positionPoint + 'px');
				
				setThisActive(currentData);
			
			} else if (type == 'month') {
				positionPoint = (options.loadMonthBuffer * options.heightMonthCell + (options.heightMonthCell / 2)) - (options.heightPicker / 2);
				$(monthRollBlock).css('top', -positionPoint + 'px');
			} else if (type == 'year') {
				positionPoint = (options.loadYearBuffer * options.heightYearCell + (options.heightYearCell / 12) * currentData[1] + (options.heightYearCell / 12) / 2) - (options.heightPicker / 2);
				$(yearRollBlock).css('top', -positionPoint + 'px');
			}
		}
		
		
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////				Renewal of Frankenstein				///////////////////
		///////////////////////////////////////////////////////////////////////////////////////
		
		// Activity switcher
		function setThisActive (getData, way) {
			var stepDirection = way ? 1 : -1;
			if(way == true) {
				for(i = 0; i < dataSet.length; i++) {
					if(dataSet[i].year == getData[0] && dataSet[i].month == getData[1]) {
						// remove the activity from current month
						if(activeMonthIndex) {
							dataSet[activeMonthIndex].activity = false;
							$(dateRollBlock + ' > li:eq(' + (activeMonthIndex + 1) + ')').removeClass('active');
						}
						// set the activity for the next on the way month
						activeMonthIndex = i;
						dataSet[activeMonthIndex].activity = true;
						$(dateRollBlock + ' > li:eq(' + (activeMonthIndex + 1) + ')').addClass('active');
						
						setDate = [dataSet[activeMonthIndex].year, dataSet[activeMonthIndex].month];
						//&& dataSet[(activeMonthIndex + options.loadDateBuffer)] == undefined
						if(way != undefined ) {
							dataSet = rebuildDataSet(setDate, way);
							
							addNewMonthIntoRoll(way);
						}

						break;
					}
				}
			} else if (way == false) {
				//for(i = 0; i < dataSet.length; i++) {
					if(dataSet[(activeMonthIndex + stepDirection)].year == getData[0] && dataSet[(activeMonthIndex + stepDirection)].month == getData[1]) {
					// remove the activity from current month
						dataSet[activeMonthIndex].activity = false;
						$(dateRollBlock + ' > li:eq(' + (activeMonthIndex + 1) + ')').removeClass('active');
						
						setDate = [dataSet[(activeMonthIndex + stepDirection)][0], dataSet[(activeMonthIndex + stepDirection)][1]];
						//&& dataSet[(activeMonthIndex + options.loadDateBuffer)] == undefined
						if(dataSet[(activeMonthIndex - (options.loadDateBuffer + 1))] == undefined) {
							dataSet = rebuildDataSet(setDate, way);
						
							addNewMonthIntoRoll(way);
							
							// set the activity for the next on the way month
							//activeMonthIndex = options.loadDateBuffer;
							dataSet[activeMonthIndex].activity = true;
							$(dateRollBlock + ' > li:eq(' + (activeMonthIndex + 1) + ')').addClass('active');
							
						} else {
							// set the activity for the next on the way month
							//activeMonthIndex = options.loadDateBuffer;
							dataSet[activeMonthIndex].activity = true;
							$(dateRollBlock + ' > li:eq(' + activeMonthIndex + ')').addClass('active');
						}
						
						//break;
					}
				//}
			} else if (way == undefined) {
				for(i = 0; i < dataSet.length; i++) {
					if(dataSet[i].year == getData[0] && dataSet[i].month == getData[1]) {
						// set the activity for the next on the way month
						activeMonthIndex = i;
						dataSet[activeMonthIndex].activity = true;
						$(dateRollBlock + ' > li:eq(' + (activeMonthIndex + 1) + ')').addClass('active');
						break;
					}
				}
			}
			
			
		}
		
		// add motion
		function slicingRolls() {
			$(dateRollBlock).mousedown(function(e){dragTheRoll(e)});

			function dragTheRoll(e) {
				//$('.' + nameGeneralClass + ' *').disableSelection();
				$(document).disableSelection();
				
				var currentPosition = Number($(dateRollBlock).css('top').replace(/[a-zA-Z]/g, ''));
				var positionY = e.pageY;
				var yCoordinate, yCoordinatePrev, deltaY, way;

				// determine the direction of movement & shift
				$(document).mousemove(function(e){
					var deltaShift = positionY - e.pageY;
					
					yCoordinate = (document.layers) ? e.pageY : e.clientY;
					deltaY = yCoordinate - yCoordinatePrev
					if ((deltaY < -1)) var way = true;
					if ((deltaY >  1)) var way = false;
					yCoordinatePrev = yCoordinate;

					$(dateRollBlock).css({'top': (currentPosition - deltaShift) + 'px'});
					coordinate(way, deltaShift);
				});
				
				$(document).mouseup(function(){
					$(document).unbind('mousemove');
				});
			}
		}
		
		// Calculating the coordinates of each month
		// Задача функции: Рассчитать текущее положение активного месяца и вызвать функцию переключения 
		// на следующий или предыдудщий месяц в зависимости от направления движения.
		function coordinate(way, deltaShift) {
			var activeZoneCord = {
				topPoint: (options.heightPicker - options.activeZoneHeight)/2,
				bottomPoint: (options.heightPicker - options.activeZoneHeight)/2 + options.activeZoneHeight 
			}
			if(activeMonthIndex == undefined){
				var startDateRollIndent = dataSet[options.loadDateBuffer].middlePoint - (options.heightPicker / 2);
			} else {
				var startDateRollIndent = dataSet[activeMonthIndex].middlePoint - (options.heightPicker / 2);
			}
			
			var startDateRollPosition = Number($(dateRollBlock).css('top').replace(/[a-zA-Z]/g, '')) + options.clearance;
			//var startDateRollPosition = $(dateRollBlock).find('li.clearance').height();
			var stepDirection;
			
			
			var dateRollHeight = $(dateRollBlock).height();
			var points = [];
			
			
			
			stepDirection = way ? 1 : -1;
			
			for(n = 0; n < dataSet.length; n++) {
				points[n] = [(startDateRollPosition + dataSet[n].topPoint), (startDateRollPosition + dataSet[n].bottomPoint)];
				
				
				var position = n + 7;
				helpData('PointsDateItem ' + n, points[n], position);
			}
			
			function transitionEdge () {
				if(enableNewMonth) return;
				enableNewMonth = true;
				
				setThisActive([dataSet[(activeMonthIndex + stepDirection)].year, dataSet[(activeMonthIndex + stepDirection)].month], way);
			}
			
			if(way == true) {
				if(points[activeMonthIndex][2] > activeZoneCord.topPoint && points[activeMonthIndex][2] < activeZoneCord.bottomPoint) {
					transitionEdge();
				}
			} else if(way == false) {
				if(points[activeMonthIndex][0] > activeZoneCord.topPoint && points[activeMonthIndex][0] < activeZoneCord.bottomPoint) {
					transitionEdge();
				}
				
			} else if(points[activeMonthIndex][0] < activeZoneCord.topPoint && points[activeMonthIndex][2] > activeZoneCord.bottomPoint) {
				enableNewMonth = false;
			}
			
			helpData('topZonePoint', activeZoneCord.topPoint, 1);
			helpData('bottomZonePoint', activeZoneCord.bottomPoint, 2);
			helpData('startDateRollPosition', startDateRollPosition, 3);
			helpData('startDateRollIndent', (startDateRollIndent + (options.heightPicker / 2)), 4);
			helpData('dateRollHeight', dateRollHeight, 5);
			
			helpData('ActiveMonthIndex', activeMonthIndex, 6);
		}
		
		
		// restructuring months tables
		function rebuildDataSet(activeMonthIndex, way) {
			var templateDataSet = [];
			var stepDirection = 0;
			var additionallyMonthItemData = [];
			
			way ? stepDirection = 1 : stepDirection = -1;
			var indexOfNewMonth = way ? dataSet.length - 1 : 0;
			
			additionallyMonthItemData = getMonthData( dateCorrection( [ dataSet[indexOfNewMonth].year, (dataSet[indexOfNewMonth].month + stepDirection) ] ), 1, true);
			
			// rewrite the array of data and supplement the missing month
			for(i = 0; i <= dataSet.length; i++) {
				if(way) {
					if(dataSet[i] != undefined) {
						templateDataSet[i] = dataSet[i];
					} else {
						templateDataSet[i] = additionallyMonthItemData[0];
					}
				} else {
					if(dataSet[i] != undefined) {
						templateDataSet[(i - stepDirection)] = dataSet[i];
					} else {
						templateDataSet[0] = additionallyMonthItemData[0];
					}
				}
			}
			
			// correct the disorder at the control points positions
			for(i = 0; i < templateDataSet.length; i++) {
				var points = getPoints(i, templateDataSet[i].height);
				
				templateDataSet[i].topPoint = points[0];
				templateDataSet[i].middlePoint = points[1];
				templateDataSet[i].bottomPoint = points[2];
				
			}

			return templateDataSet;
		}
		
		// obtain the control points
		function getPoints(indexNumber, height) {
			if( indexNumber == 0) {
				var startPoint = 0;
			} else {
				var startPoint = dataSet[indexNumber - 1].bottomPoint + 1;
			}
			var middlePoint = startPoint + height / 2;
			var endPoint = startPoint + height;
			
			return points = [startPoint, middlePoint, endPoint];
		}
		
		
		// Inserting new Month
		function addNewMonthIntoRoll(way) {
			var monthData;
			if(way) {
				monthData = dataSet[(dataSet.length - 1)].data;
				$(dateRollBlock).append(monthData);
			} else {
				monthData = dataSet[0].data;
				$(dateRollBlock).find('li.clearance').after(monthData);

				correctRollIndent();
			}
			
		}
		
		// Correcting roll Indent after adding new month
		function correctRollIndent() {
			var getEmptyIndent = dataSet[0].height;
			var currentDateRollPosition = $(dateRollBlock).find('li.clearance').height();
			$(dateRollBlock).find('li.clearance').height(currentDateRollPosition - getEmptyIndent)
			//$(dateRollBlock).css('top', currentDateRollPosition - getEmptyIndent + 'px')
		}
		
		// Вызов генерирующих функций и навешивание функционала
		function buildDatePicker(year, month) {
			dataSet = getMonthData([year, month]);
	
			// Генерируем месяцы
			getDateRoll(year, month);
			getMonthRoll(year, month);
			getYearRoll(year, month);
			
			// Присабачиваем ползанье
			//firstInstallation();
			//
		}
		
		function activateDatePicker() {
			slicingRolls();
			//dragRolls();
			//mouseWheelRolls();
		}
		
		function helpData(name, data, index){
			var helper = $('.datePickerTempInformation');
			
			if(typeof(data) == 'number' || typeof(data) == 'string'){
				helper.children('div.text' + index).html(name + ': <b>' + data + '</b>');
			} else if(typeof(data) == 'object') {
				var text = '';
				for(i = 0; i < data.length; i++) {
					text += name + ': <b>' + data[i] + '</b><br />';
				}
				helper.children('div.text' + index).html(text);
			}
		
		}
		
	}
		
		

})(jQuery);


jQuery.fn.extend({ 
    disableSelection : function() { 
            this.each(function() { 
                    this.onselectstart = function() { return false; }; 
                    this.unselectable = "on"; 
                    jQuery(this).css('-moz-user-select', 'none'); 
            }); 
    },
    enableSelection : function() { 
            this.each(function() { 
                    this.onselectstart = function() {}; 
                    this.unselectable = "off"; 
                    jQuery(this).css('-moz-user-select', 'auto'); 
            }); 
    } 
});