/* Date Picker v0.1.2
 * http://alexfadeev.com/datepicker/
 *
 * Licensed under the WTFPL licenses.
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
			yearPeriod: [1901,2029],
			monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
			dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
			dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			dayLocale: 1,
			loadDateBuffer: 6,
			loadMonthBuffer: 12,
			loadYearBuffer: 10,
			daysInWeeks: 7,
			nameGeneralClass: 'datePickerContent',
			heightPicker: 400,
			widthPicker: 400,
			heightDateCell: 28,
			widthDateCell: 28,
			dateCellBorderSize: 1,
			heightMonthCell: 25,
			widthMonthCell: 80,
			heightYearCell: 25,
			widthYearCell: 50
		}, options);
		var monthCountPrepare = 0;
		var dateHeightSize = monthHeightSize = yearHeightSize = 0;
		var dataSet = [];
		var currentMonth = 0;
		var startPoint = 0;
		var endPoint = 0;
		var dateSummaryPrevHeight = 0;
		
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
		var generalElement = '<div class="'+ options.nameGeneralClass +'"><div class="redLine"></div><div class="dateBorder"></div><div class="monthBorder"></div><div class="yearBorder"></div></div>';
		var dateRollBlock = '.dateRoll ul.rollWall';
		var monthRollBlock = '.monthRoll ul.rollWall';
		var yearRollBlock = '.yearRoll ul.rollWall';
		
		
		
		
		return this.each(function() {
			$(this).parent().append(generalElement);
			
			$(this).focusin(function(){
				if(!($(nameGeneralClass).hasClass('included'))) {
					$(nameGeneralClass).addClass('included visible');
					buildDatePicker(year, month, day);
					//activateDatePicker();
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
		
		
		function getMonthData (innerCalculateDate) {
			// === Variables === //
			var monthData = [];
			var count = options.loadDateBuffer * 2 + 1;
			// === Variables === //
			

			function dateCorrection (innerDate) {
				// === Variables === //
				var innerYear = innerDate[0];
				var innerMonth = innerDate[1];
				var outMonth, outYear;
				var outDate = [];
				// === Variables === //
				
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
			
			function getPoints(date, indexNumber, height) {
				// Стартовое значение точек.
				if( indexNumber == 0) {
					var startPoint = 0;
				} else {
					var startPoint = monthData[indexNumber - 1][6];
				}
				var middlePoint = startPoint + height / 2;
				var endPoint = startPoint + height;
				
				return points = [startPoint, middlePoint, endPoint];
			}
			
			for (indexNumber = 0; indexNumber < count; indexNumber++) {
				
				var calcMonth = innerCalculateDate[1] + (indexNumber - options.loadDateBuffer);
				var date = dateCorrection([innerCalculateDate[0], calcMonth]); // Коррекция месяца и года
				var monthTable = getMonthTable(date[0], date[1]); // получение таблицы месяца и сопровоздающих значений
				var points = getPoints(date, indexNumber, monthTable[2]); // Рассчет точек координации
				
				monthData[indexNumber] = [date[0], date[1], monthTable[2], monthTable[1], points[0], points[1], points[2], monthTable[0]]; // формирование массива данных
			}
			
			return monthData;
			
		}
		
		
		
		// Генерация списка датовых табличек
		function getDateRoll (year, month) {
			$('.'+ options.nameGeneralClass).append('<div class="dateRoll roll"><ul class="rollWall"></ul></div>');
			for (i = 0; i < (options.loadDateBuffer * 2 + 1); i++) {
				$(dateRollBlock).append(dataSet[i][7]);
			}
			zeroPositioning([year, month], 'date');
		}
		
		// Генерация списка месяцев
		function getMonthRoll (year, month) {
			$('.'+ options.nameGeneralClass).append('<div class="monthRoll roll"><ul class="rollWall"></ul></div>');
			$('.monthRoll ul.rollWall').html(getMonthList(year, month));
			
			zeroPositioning([year, month], 'month');
		}
		
		// Генерация списка годов
		function getYearRoll (year) {
			$('.'+ options.nameGeneralClass).append('<div class="yearRoll roll"><ul class="rollWall"></ul></div>');
			$('.yearRoll ul.rollWall').html(getYearList(year));
			
			zeroPositioning([year, month], 'year');
		}
		
		
		
		
		
		// Генерация списка месяцев
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
				
				//Выявляем текущий месяц
				var today = new Date();
				var currentMonth = isCurrent(insertYear, insertMonth, today.getDate());
				
				var activeMonth = '';
				if(insertMonth == today.getMonth() && insertYear == today.getFullYear()) {
					activeMonth = 'active';
				}
				
				generatedMonthList += '<li class="monthItem '+ currentMonth +' '+ activeMonth +' '+ insertMonth +'-'+ insertYear +'">'+options.monthNames[insertMonth]+'</li>';
			}
			return generatedMonthList;
		}
		
		// Генерация списка годов
		function getYearList(year) {
			var generatedYearList = '';
			var preYears = year - options.loadYearBuffer;
			var postYears = year + options.loadYearBuffer;
			var today = new Date();
			
			
			for(i = preYears; i <= postYears; i++){
				var currentYear = isCurrent(i, today.getMonth(), today.getDate());
				
				var activeYear = '';
				if(i == today.getFullYear()) {
					activeYear = 'active';
				}
				
				generatedYearList += '<li class="yearItem '+ activeYear +' '+ i +'">'+ i +'</li>';
			}
			return generatedYearList;
		}
		
		
		//Генерация блока одного месяца
		function getMonthTable (year, month, index) {
			var generatedMonthTable = '';
			var calculatedDate = new Date(year,month);
			var calculatedIsLong = !(calculatedDate.getFullYear() % 4);
			var monthLimits = [31, calculatedIsLong ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var count = 0;
			var day = calculatedDate.getDay();
			//var activeMonth = [year, month];
			var oneMonthData = [];

			// Вставка пустых ячеек
			function insertEmptySquare(start, limit) {
				start > 1 ? start += 1 : start = 1;
				for(i = start; i < limit; i++){
					generatedMonthTable += '<li class="empty"></li>';
					//Счетчик ячеек
					count++;
				}
			}
			
			// Проверка на выходной день
			function isWeekend(year, month, day) {
				calculatedDate = new Date(year, month, day);
				day = calculatedDate.getDay();
				if(day-1 > 4 || day == 0){ 
					return 'weekend';
				} else {
					return '';
				}
			}
			
			// Названия дней недели
			for(d = 1; d < 8; d++) {
				var weekend = d > 5 ? 'weekend' : '';
				if(d == options.daysInWeeks) d = 0
				generatedMonthTable += '<li class="dayName '+weekend+'">'+ options.dayNamesShort[d] +'</li>';
				//Счетчик ячеек
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
				
				generatedMonthTable += '<li class="'+ currentDate +' '+isWeekend(year,month,i)+'">'+ i +'</li>';
				//Счетчик ячеек
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
			
			//var activeMonth = isActive(year, month);
			
			
			//if(index == undefined){ 
				//index = monthCountPrepare;
			//}
			//dateData[index] = [year, month, Math.ceil(count / options.daysInWeeks) * (options.heightDateCell+1) + 25 + 2 + 5, count, startPoint, ];
			
			var activeDate = '';
			if(month == today.getMonth()) {
				activeDate = 'active';
			}
			var height = Math.ceil(count / options.daysInWeeks) * (options.heightDateCell+1) + 25 + 2 + 5;
			
			var monthItem = ('<li class="oneMonth ' + activeDate + ' ' + (month+1) + '-' + year +' h' + height + '"><h6>' + options.monthNames[month] + '</h6><span>' + year + '</span><ul class="month mb' + Math.ceil(count / options.daysInWeeks) +'r">' + generatedMonthTable + '</ul></li>');
			//monthCountPrepare++;
			return oneMonthData = [monthItem, count, height];
		}
		
		// Проверка входящего дня на сегодняшнесть
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
				positionPoint = dataSet[indexMonth][5] - (options.heightPicker / 2);
				$(dateRollBlock).css('top', -positionPoint + 'px');
				//alert(positionPoint);
			} else if (type == 'month') {
				positionPoint = (options.loadMonthBuffer * options.heightMonthCell + (options.heightMonthCell / 2)) - (options.heightPicker / 2);
				$(monthRollBlock).css('top', -positionPoint + 'px');
			} else if(type == 'year') {
				positionPoint = (options.loadYearBuffer * options.heightYearCell + (options.heightYearCell / 12) * currentData[1]) - (options.heightPicker / 2);
				$(yearRollBlock).css('top', -positionPoint + 'px');
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////				Оживление франкенштейна				///////////////////
		///////////////////////////////////////////////////////////////////////////////////////
		
		
		
		// Установления активности месяца и года
		/*function isActive(activeYear, activeMonth) {
			var activatedMonth = [activeYear, activeMonth];
			
			if(activatedMonth[0] == undefined || activatedMonth[1] == undefined) {
				activatedMonth[0] = today.getFullYear();
				activatedMonth[1] = today.getMonth();
			}
			
			$('.content .dateRoll ul.rollWall li.'+ activatedMonth[1] +'-'+activatedMonth[0]).click(function(){
				$(this).parent('ul').position({ of: $('.dateRoll')
												//my: left top
											});
			});
		}*/
		
		// Движение плашек
			
		// Присабачиваем плавучесть к блокам календаря
		/*function dragRolls() {
			$(dateRollBlock).draggable({
				axis: 'y',
				drag: function(event, ui) {
					var size = $(this).position({
						of: $(options.nameGeneralClass),
						//at: 'left center',
						//my: 'left center',
						collision: 'flip flip'
					});
					//alert(size);
					var middlePoint = dateData[]
					var dateDragSize = ['drag', 'date', size.top];
					//propulsionRoll(dateDragSize);
					//sinhronizationRolls(dateDragSize);
					$("div.text").text('Drag date: ' + dateDragSize[2]);
				}
				
			});
			
			$(monthRollBlock).draggable({
				axis: 'y',
				drag: function(event, ui) {
					var size = $(this).position();
					var monthDragSize = ['drag', 'month', size.top];
					//propulsionRoll(monthDragSize);
					//sinhronizationRolls(monthDragSize);
					//$("div.text").text('Drag month: ' + monthDragSize[2]);
				}
			});
			
			$(yearRollBlock).draggable({
				axis: 'y',
				drag: function(event, ui) {
					var size = $(this).position();
					var yearDragSize = ['drag', 'year', size.top];
					//propulsionRoll(yearDragSize);
					//sinhronizationRolls(yearDragSize);
					//$("div.text").text('Drag year: ' + yearDragSize[2]);
				}
			});
		}*/
		
		// Присабачиваем прокрутку колесиком мышки
		/*function mouseWheelRolls(){
			var size = [0, 0, 0];
			$(dateRollBlock).mousewheel(function(event, delta) {
				//var size = $(this).position();
				if(delta > 0) {
					size[0]++;
				} else if (delta < 0)  {
					size[0]--;
				}
				var dateWheelSize = ['wheel', 'date', size[0]];
				//propulsionRoll(dateWheelSize);
				
				
				//var dateWheelSize = delta;
				
				
				//$("div.text").text('Wheel date:' + dateWheelSize);
				//console.log(dateWheelSize);
			});
			$(monthRollBlock).mousewheel(function(event, delta) {
				//var monthWheelSize = delta;
				if(delta > 0) {
					size[1]++;
				} else if (delta < 0)  {
					size[1]--;
				}
				var monthWheelSize = ['wheel', 'month', size[1]];
				//propulsionRoll(monthWheelSize);
			});
			$(yearRollBlock).mousewheel(function(event, delta) {
				if(delta > 0) {
					size[2]++;
				} else if (delta < 0)  {
					size[2]--;
				}
				var yearWheelSize = ['wheel', 'month', size[2]];
				//propulsionRoll(yearWheelSize);
			});
		}*/
				
		// Синхронизация движения плашек
		/*function sinhronizationRolls(dataMassive) {
			var moveType = dataMassive[0];
			var rollType = dataMassive[1];
			var moveDelta = dataMassive[2];
			
			//var dateTopIndent = 0;
			var dateTopIndent = (dateHeightSize - options.heightPicker)/2;
			var monthTopIndent = (monthHeightSize - options.heightPicker)/2;
			var yearTopIndent = (yearHeightSize - options.heightPicker)/2;
			//var dateTopIndent = Number($(dateRollBlock).css('top').replace(/[a-zA-Z]/g,""));
			var dateResaltIndent = moveDelta + dateTopIndent;
			$(dateRollBlock).css('top', dateResaltIndent + 'px');
			
			var monthBlockShift = dateResaltIndent / ( 206 / options.heightMonthCell);
			var monthResaltIndent = monthBlockShift - monthTopIndent;
			$(monthRollBlock).css('top', monthResaltIndent + 'px');
			
			var yearBlockShift = monthBlockShift / 12;
			var yearResultIndent = yearBlockShift - yearTopIndent;
			$(yearRollBlock).css('top', yearResultIndent + 'px');
		}*/
		
		// Двигаем панельки
		/*function propulsionRoll(dataMassive) {
			var moveType = dataMassive[0],
				rollType = dataMassive[1],
				moveDelta = dataMassive[2],
				
				dateItemCount = options.loadDateBuffer * 2 + 1,
				monthItemCount = options.loadMonthBuffer * 2 + 1,
				yearItemCount = options.loadYearBuffer * 2 + 1,
				
				dateTopIndent = (dateHeightSize - options.heightPicker)/2,
				monthTopIndent = (monthHeightSize - options.heightPicker)/2,
				yearTopIndent = (yearHeightSize - options.heightPicker)/2;
				
			var dateHeightSizeShift = dateSummaryPrevHeight;
			var monthHeightSizeShift = (monthHeightSize - options.heightPicker)/2;
			var yearHeightSizeShift = (yearHeightSize - options.heightPicker)/2;
			
			var yearResultIndent = 0;
			var monthResaltIndent = 0;
			var dateResaltIndent = 0;
			
			
			
			if(rollType == 'date'){
				dateResaltIndent = moveDelta + dateHeightSizeShift;
				//activeMonth = getActiveMonth(rollType, dateResaltIndent, dateItemCount);
				//monthResaltIndent = dateResaltIndent / (dateData[activeMonth][2] / options.heightMonthCell);
				//yearResultIndent = monthResaltIndent / (options.heightMonthCell / (options.heightYearCell / 12));
			} else if(rollType == 'month') {
				//activeMonth = getActiveMonth(rollType, moveDelta, monthItemCount);
				//monthResaltIndent = moveDelta + monthHeightSizeShift;
				//yearResultIndent = monthResaltIndent / (options.heightMonthCell / (options.heightYearCell / 12));
				//dateResaltIndent = monthResaltIndent * (dateData[activeMonth][2] / options.heightMonthCell);
			} else if(rollType == 'year') {
				//activeMonth = getActiveMonth(rollType, moveDelta, yearItemCount);
				//yearResultIndent = moveDelta + yearHeightSizeShift;
				//monthResaltIndent = yearResultIndent * (options.heightMonthCell / (options.heightYearCell / 12));
				//dateResaltIndent = monthResaltIndent * (dateData[activeMonth][2] / options.heightMonthCell);
			}
			
			//$("div.text").text('Date indent: '+ dateResaltIndent + ' Month indent: ' + monthResaltIndent + ' Year indent:' + yearResultIndent);
			
			//$("div.text2").text(dateItemCount+' '+monthItemCount+' '+yearItemCount);
			//$("div.text").text(dataMassive[0] + ' ' + dataMassive[1] + ': ' + dataMassive[2]);
			//$("div.text3").text('[' + dateHeightSize + ',' + monthHeightSize + ',' + yearHeightSize + ']');
		}*/
		
		/*function getActiveMonth(type, delta, count){
			//var dateTablesDistances = [];
			
			if(type == 'date') {
				var index = $(dateRollBlock + ' > li.current').prevAll().length;
				var currentMonthIndex = dateData[index][1];
				var currentYearIndex = dateData[index][0];
				var startPoint = 0; 
				var endPoint = 0; 
				var zeroPoint = 0;
				var dateBlockSize = dateData[index][2] // Высота блока

				
				var dateShiftCoordinate = delta + dateBlockSize/2
				
				
				for(i = 0; i < (options.loadDateBuffer); i++) {
					startPoint = endPoint; // Координата начальной точки текущего месяца
					endPoint +=  dateData[i+1][2]; // Координата конечной точки текущего месяца
					//zeroPoint += dateData[i][2];
				}
				zeroPoint = startPoint + (dateData[month][2] / 2) -2.5; // Расчет координаты середины блока текущего месяца
				
				
				if( startPoint > (zeroPoint + delta)) {
					changeCurrentMonth(currentMonthIndex);
				} else if(endPoint < (zeroPoint + delta)) {
					changeCurrentMonth(currentMonthIndex);
				} else if (startPoint <= (zeroPoint + delta) <= endPoint) {
					$("div.text3").text('current ' + currentMonthIndex);
				}
				
				function changeCurrentMonth(currentMonthIndex, type) {
					currentMonthIndex++;
						$("div.text3").text('current ' + currentMonthIndex);
					$(dateRollBlock + ' > li.current').removeClass('current');
					//currentMonthIndex++;
					var way = true;
					castling(currentMonthIndex, type, way, zeroPoint);
				}
				
				$("div.text2").text('[' + startPoint + ',' + zeroPoint + ',' + endPoint + ',' + (delta + zeroPoint) + ',' + dateBlockSize + ',' + delta + ']');
				
			} else if (type == 'month'){
			
			} else if(type == 'year'){
			
			}
		
			return currentMonthIndex;
		}*/
		
		/*function castling(index, type, way, zeroPoint) {
			var tempDateData = [];
			var count = options.loadDateBuffer * 2 + 1;
			
			if(way) {
				var firstMonth = [dateData[0][0], (dateData[0][1] + 1)];
				var lastMonth = [dateData[(options.loadDateBuffer * 2)][0], dateData[(options.loadDateBuffer * 2)][1] + 1];
				var y = zeroPoint  - (options.heightPicker/2);// - dateData[0][2];
				
				$(dateRollBlock).find('li.' + (dateData[0][1]+1) + '-' + dateData[0][0]).empty().remove();
				$(dateRollBlock).css('top', -y + 'px');
				$(dateRollBlock).append(getMonthTable(lastMonth[0], lastMonth[1]));
				$(dateRollBlock + ' > li.' + (index+1) + '-' + dateData[index+1][0]).addClass('current');
			} else {
				var firstMonth = index - options.loadDateBuffer - 2;
				var lastMonth = firstMonth + (options.loadDateBuffer * 2 + 1);
			}
			
			//for(i = 0; i < count; i++){
			//	tempDateData[i] = dateData[i+1];
			//}
			
			
		}*/
		
		function centeringRolls() {
			// Получаем высоту блоков
			dateHeightSize = $(dateRollBlock).height();
			monthHeightSize = $(monthRollBlock).height();
			yearHeightSize = $(yearRollBlock).height();
			
			
			for(i = 0; i < (options.loadDateBuffer - 1); i++) {
				dateSummaryPrevHeight += dateData[i][2];
			}
			dateSummaryPrevHeight += (dateData[month][2] / 2) + 5;
			
			// Рассчитываем смещение для центровки
			var dateHeightSizeShift = dateSummaryPrevHeight;
			var monthHeightSizeShift = (monthHeightSize - options.heightPicker)/2;
			var yearHeightSizeShift = (yearHeightSize - options.heightPicker)/2;
			// Центрируем
			$(dateRollBlock).css('top', '-' + dateHeightSizeShift + 'px');
			$(monthRollBlock).css('top', '-' + monthHeightSizeShift + 'px');
			$(yearRollBlock).css('top', '-' + yearHeightSizeShift + 'px');
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
			//dragRolls();
			//mouseWheelRolls();
		}
		
		
		
		
	}

})(jQuery);