<script>
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// MFL LIVE SCORING  https://raw.githubusercontent.com/mitchc1313/MyFantaseaLeague/main/Scoreboard.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if ($('#body_ajax_ls').length) {
	if ($('script[src*="mfl_live_scoring.js"]').length === 0 || liveScoringWeek === 0) {
		console.log("Live Scoring JS File Not Present Or LiveScoring Has Not Started");
		$("#body_ajax_ls #marquee_home, #body_ajax_ls #marquee_away").show();
		$('#container-wrap').html('<h2 class="warning">Live Scoring Will Start 24 Hours Prior To Kickoff Of First Game Of The Week</h2>');
	} else {
		////////////////////////////////////////////////////////////////////
		//                    CONSOLE LOG SCRIPT DATE                     //
		////////////////////////////////////////////////////////////////////
		console.log("REPLACE MFL SCORING SCRIPT LAST UPDATED 12-10-21");


		////////////////////////////////////////////////////////////////////
		//                          SET GLOBAR VAR                        //
		////////////////////////////////////////////////////////////////////
		var ls_ticker_speed = 200;
		var ls_away_id;
		var ls_home_id;
		var ls_pace_tracker = new Array();
		if (ls_scoreboardName === undefined) var ls_scoreboardName = "Live Scoring";
		if (showTeamName === undefined) var showTeamName = true;
		if (showTeamIcon === undefined) var showTeamIcon = true;
		if (ls_includeProjections === undefined) var ls_includeProjections = true;
		if (ls_includeInjuryStatus === undefined) var ls_includeInjuryStatus = true;
		if (ls_loader === undefined) var ls_loader = false;
		if (ls_excludeIR === undefined) var ls_excludeIR = false;
		if (ls_excludeTaxi === undefined) var ls_excludeTaxi = false;
		if (ls_orig_proj_when_final === undefined) var ls_orig_proj_when_final = false;
		if (ls_box_abbrev_name_icon === undefined) var ls_box_abbrev_name_icon = 2;
		if (ls_popup_abbrev_name_icon === undefined) var ls_popup_abbrev_name_icon = 0;
		if (ls_popup_status === undefined) var ls_popup_status = false;
		if (ls_hide_bye_teams === undefined) var ls_hide_bye_teams = false;
		if (ls_show_win_probability === undefined) var ls_show_win_probability = false;
		if (isAllPlay) var ls_show_win_probability = false;
		if (ls_is_live_week === undefined) var ls_is_live_week = true;
		if (largeLeagueSB === undefined) var largeLeagueSB = false;
		if (BreakRows === undefined) var BreakRows = 1; // DEFAULT TO FALSE ONLY USED FOR ALL PLAY AND PLAYOFF LEAGUES TO MAKE 2ND ROW OF MATCHUPS
		if (fixedWidthBox === undefined) var fixedWidthBox = false; // DEFAULT TO FALSE ONLY USED FOR ALL PLAY AND PLAYOFF LEAGUES TO FIX BOX WIDTHS
		if (setBoxWidth === undefined) var setBoxWidth = "150"; // DEFAULT TO FAULT ONLY USED FOR ALL PLAY AND PLAYOFF LEAGUES TO MAKE 2ND ROW OF MATCHUPS
		var ls_onSwitch = false;
		if (ls_commish_id === undefined) var ls_commish_id = "0001";
		var ls_trigger_run = 1;
		var ls_global_allplay;
		var ls_target_franchise = "";
		if (typeof franchise_id !== "undefined") {
			if (franchise_id === "0000")
				ls_target_franchise = ls_commish_id;
			else
				ls_target_franchise = franchise_id;
		} // end SET GLOBAR VAR


		////////////////////////////////////////////////////////////////////
		//               RUN THESE FUNCTIONS ON PAGE LOAD                 //
		////////////////////////////////////////////////////////////////////

		////////////////////////////////////////////////////////////////////
		//            SET VAR FOR LIVE OR PREVIOUS WEEK                   //
		////////////////////////////////////////////////////////////////////
		if (typeof ls_liveScoringWeekCheck !== "undefined") {
			if (location.href.indexOf("W=") === -1) {
				if (liveScoringWeek < 1) var _liveScoringWeek = 1;
				else var _liveScoringWeek = liveScoringWeek;
			} else
				var _liveScoringWeek = parseInt(location.href.substr(location.href.indexOf("W=") + 2, 2));
			if (liveScoringWeek !== _liveScoringWeek) ls_is_live_week = false;
		} // end SET VAR FOR LIVE OR PREVIOUS WEEK


		////////////////////////////////////////////////////////////////////
		//                    RUN SCOREBOARD FUNCTIONS                    //
		////////////////////////////////////////////////////////////////////
		var seasonNotAvailable = $('#body_ajax_ls h3.warning:contains("Scoring"):contains("Not"):contains("Available")');
		var seasonNotAvailablePay = $('#body_ajax_ls h3.warning:contains("league"):contains("not"):contains("paid")');
		if ($(seasonNotAvailablePay).length) {
			$('<h3 id="ls_error" class="warning h3-menu" style="max-width:31.25rem;visibility:visible;margin:0 auto"><span style="font-size:1.75rem;display:block;text-align:center">Live Scoring has failed to load.</span><br><span style="font-size:1.25rem;display:block;text-align:center">Scoring not available for unpaid leagues</span></h3>').insertBefore(seasonNotAvailablePay);
			$(seasonNotAvailablePay).remove();
		} else if (($(seasonNotAvailable).length) || (liveScoringWeek < 1 || liveScoringWeek > 23)) {
			$('<h3 id="ls_error" class="warning h3-menu" style="max-width:31.25rem;visibility:visible;margin:0 auto"><span style="font-size:1.75rem;display:block;text-align:center">Live Scoring has failed to load.</span><br><span style="font-size:1.25rem;display:block;text-align:center">There are several reasons why this may happen.</span><br><span style="font-size:0.875rem;display:block;text-align:left">1. The regular season has not started (MFL starts live scoring 24 hours prior to kickeoff of Week 1 games)</span><span style="font-size:0.875rem;display:block;text-align:left;padding-top:0.313rem">2. This is a playoff league and the playoff week has not started (MFL starts live scoring 24 hours prior to kickoff of first playoff game)</span><span style="font-size:0.875rem;display:block;text-align:left;padding-top:0.313rem">3. NFL Season has ended. (MFL disables scoring once the season has ended)</span><span style="font-size:0.875rem;display:block;text-align:left;padding-top:0.625rem">Please contact your commissioner or see the MFL support thread link located below if you feel the scoreboard has not loaded for some other reason <br><br><span style="display:block;text-align:center;padding:0.625rem 0 1.25rem 0;"><a href="http://forums.myfantasyleague.com/forums/index.php?showtopic=38170" target="_blank">Support</a></span></span></h3>').insertBefore(seasonNotAvailable);
			$(seasonNotAvailable).remove();
		} else {
			try {
				ls_player[""] = new LSPlayer("", "Blank", "QB", "FA", "QB");
			} catch (error) {};
			ls_setup_html();
			ls_append_css();
			if (typeof ls_liveScoringWeekCheck !== "undefined") {
				ls_navbar()
			}
			if (triggerLiveScoring_ran === undefined) var triggerLiveScoring_ran = false;
			if (triggerLiveScoring_count === undefined) var triggerLiveScoring_count = 0;
			if (largeLeagueSB) {
				if (liveScoringListener === undefined) var liveScoringListener = setInterval("liveScoringListenerCheck()", 1000);
			} else {
				if (liveScoringListener === undefined) var liveScoringListener = setInterval("liveScoringListenerCheck()", 100);
			}
			ls_error_check();
		} // end RUN SCOREBOARD FUNCTIONS


		////////////////////////////////////////////////////////////////////
		// LOADING CIRCLE AND ERROR MESSAGE && TRIGGER CLICK SWITCH GAME  //
		////////////////////////////////////////////////////////////////////
		function ls_error_check() {
			$('<div class="ls_loading_message" style="visibility:visible"><div id="MFLPlayerPopupLoading" style="top:auto;position:relative;transform:none"><center>Loading Live Scoreboard . . .<br><br><div class="MFLPlayerPopupLoader"></div></center></div></div>').insertBefore('#myNavigationHolder');

			if (ls_loader) {
				//do nothing
			} else {
				$('.ls_loading_message #MFLPlayerPopupLoading').remove();
			}

			var ls_has_triggered = false; // set global var when game is triggered click - then wait and hide spinner
			var listenerCleared = false; // liveScoringListener has timed out - show error message
			var errorMsgCk = setInterval(function () {
				if (ls_trigger_run === 126 || ls_trigger_run === 212) {
					show_game();
					setTimeout(() => {
						ls_reorder_ls_games();
						setTimeout(() => {
							if (!ls_is_live_week) {
								$('#other_games div[id*="og_"]:visible:first').trigger('click');
							}
							if (ls_hide_bye_teams) {
								if ($('#other_games .current_matchup').is(":hidden")) {
									$('#other_games div[id*="og_"]:visible:first').trigger('click');
									//console.log("Bye week team hidden with current class")
								}
							}
							ls_has_triggered = true;
						}, 10);
					}, 50);
					clearInterval(errorMsgCk, listenerCk);
				}
			}, 50);

			var errorClassCk = setInterval(function () {
				if (ls_has_triggered) {
					$('.ls_loading_message,#ls_error').remove();
					$('head').append('<style>#body_ajax_ls #myNavigationHolder,#body_ajax_ls #ls_setting_drop,#body_ajax_ls table[style="margin-top: 0.313rem"],#body_ajax_ls table[style*="margin-top: 0.313rem"],#body_ajax_ls #ls_mfl_notes,#body_ajax_ls #ls_ticker_tab_id,#body_ajax_ls table[style*="margin-top: 0.313rem"] + div.mobile-wrap,#body_ajax_ls table[style="margin-top: 0.313rem"] + div.mobile-wrap{visibility:visible!important}</style>');
					if (!$('div[id*="og_"]').is(':visible')) {
						$('.ls-outer-table').replaceWith('<h3 class="warning" style="font-size:1.25rem;padding:1.25rem 0;visibility:visible">There are no fantasy matchups this week or all teams on bye</h3>');
						$('#ls_ticker_tab_id,#ls_mfl_notes,.settings-mobile-wrap').remove();
					}
					clearInterval(errorClassCk, listenerCk);
				}
			}, 10);

			var listenerCk = setInterval(function () {
				if (listenerCleared) {
					$('.ls_loading_message').removeClass('ls_loading_message').addClass('ls_loading_message_offseason');
					$('.ls_loading_message_offseason').replaceWith('<h3 id="ls_error" class="warning h3-menu" style="max-width:31.25rem;visibility:visible;margin:0 auto"><span style="font-size:1.75rem;display:block;text-align:center">Live Scoring has failed to load.</span><br><span style="font-size:1.25rem;display:block;text-align:center">There are 2 different reasons why this has happened.</span><br><span style="font-size:0.875rem;display:block;text-align:left">1. You have accessed this page during the offseason. MFL does not display Live Scores after the season has ended or up to 24 hours before kickoff of week 1 games.</span><br><span style="font-size:0.875rem;display:block;text-align:left">2. The scoring has failed to load for some other reason. Please contact your commissioner or see the MFL support thread located <a href="http://forums.myfantasyleague.com/forums/index.php?showtopic=38170" target="_blank">HERE</a></span></h3>');
					clearInterval(errorMsgCk, errorClassCk, listenerCk);
				}
			}, 100); // end LOADING CIRCLE AND ERROR MESSAGE && TRIGGER CLICK SWITCH GAME
		} // end ls_error_check


		////////////////////////////////////////////////////////////////////
		//                 REMOVE ADS ON SCORING PAGE                     //
		////////////////////////////////////////////////////////////////////
		$('div[id*="usmg_ad"],#ajax_ls div[style="margin-bottom:5px;"]').remove();
		$('[src="/ads/ad-live_scoring_js.html"]').remove();
		googletag = null;

		// Deftect mobile devices and remove custom scrollbar css that add heights on mobiles
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule('::-webkit-scrollbar{display:none}');
		} // end REMOVE ADS ON SCORING PAGE	


		////////////////////////////////////////////////////////////////////
		//      LIST ALL FUNCTIONS IN THIS SCRIPT IN ORDER WRITTEN        //
		////////////////////////////////////////////////////////////////////

		// ls_reorder_ls_games
		// ls_append_css
		// ls_hide_projections(checkbox)	
		// ls_hide_nfl_boxscore(checkbox)
		// ls_get_player_projection(pid)
		// ls_hideProbability
		// ls_update_projections
		// ls_parse_injuries
		// ls_check_if_bye
		// ls_check_if_final
		// ls_format_score
		// ls_removeIR
		// ls_removeTaxi
		// switch_game
		// ls_after_update_scores
		// ls_navbar
		// ls_update_nfl_records
		// ls_update_nfl_schedule
		// ls_update_weekly_results_allplay
		// ls_update_weekly_results
		// ls_update_week
		// ls_create_players_roster
		// ls_nfl_stats_popup_setup
		// ls_nfl_stats_popup
		// ls_update_nfl_box
		// ls_create_nfl_box
		// ls_explain_points
		// triggerLiveScoring
		// liveScoringListenerCheck
		// ls_setup_html
		// update_scores - rewrite mfl function
		// init_marquee - rewrite mfl function
		// update_game_status - rewrite mfl function
		// update_class_by_class - rewrite mfl function
		// build_other_games - rewrite mfl function
		// ls_get_icon_abbrev
		// build_one_team - rewrite mfl function


		////////////////////////////////////////////////////////////////////
		//              FUNCTION - ls_reorder_ls_games                    //
		////////////////////////////////////////////////////////////////////
		function ls_reorder_ls_games() {
			if (ls_vert_og) {
				// validate that ls_target_franchise is scheduled
				for (var i = 0; i < ls_games.length; i++) {
					if (ls_games[i] === ls_target_franchise) ls_global_allplay = ls_target_franchise;
				}
				// if not assigned then assigned to first franchise
				if (ls_global_allplay === undefined) ls_global_allplay = ls_games[0];
				var new_ls_games = [];
				switch_game(ls_global_allplay, '');
			} else {
				var new_ls_games = [];
				//ADD TARGET FRANCHISE TO BEGINNING
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < ls_games.length; j++) {
						switch (i) {
							case 0:
								if (ls_games[j].split(",")[0] !== "BYE" && ls_games[j].split(",")[0] !== "AVG" && ls_games[j].split(",")[1] !== "BYE" && ls_games[j].split(",")[1] !== "AVG") {
									if (ls_target_franchise === ls_games[j].split(",")[0] || ls_target_franchise === ls_games[j].split(",")[1])
										new_ls_games.push(ls_games[j]);
								}
								break;
							case 1:
								if (ls_games[j].split(",")[0] === "AVG" || ls_games[j].split(",")[1] === "AVG") {
									if (ls_target_franchise === ls_games[j].split(",")[0] || ls_target_franchise === ls_games[j].split(",")[1])
										if (ls_games[j].split(",")[1] === "AVG") //IF HOME IS AVG THEN SWAP
											new_ls_games.push(ls_games[j].split(",")[1] + "," + ls_games[j].split(",")[0]);
										else
											new_ls_games.push(ls_games[j]);
								}
								break;
							case 2:
								if (ls_games[j].split(",")[0] === "BYE" || ls_games[j].split(",")[1] === "BYE") {
									if (ls_target_franchise === ls_games[j].split(",")[0] || ls_target_franchise === ls_games[j].split(",")[1])
										if (ls_games[j].split(",")[1] === "BYE") //IF HOME IS BYE THEN SWAP
											new_ls_games.push(ls_games[j].split(",")[1] + "," + ls_games[j].split(",")[0]);
										else
											new_ls_games.push(ls_games[j]);
								}
								break;
						}
					}
				}
				//ADD REMAINING FRANCHISES
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < ls_games.length; j++) {
						switch (i) {
							case 0:
								if (ls_games[j].split(",")[0] !== "BYE" && ls_games[j].split(",")[0] !== "AVG" && ls_games[j].split(",")[1] !== "BYE" && ls_games[j].split(",")[1] !== "AVG") {
									if (ls_target_franchise !== ls_games[j].split(",")[0] && ls_target_franchise !== ls_games[j].split(",")[1])
										new_ls_games.push(ls_games[j]);
								}
								break;
							case 1:
								if (ls_games[j].split(",")[0] === "AVG" || ls_games[j].split(",")[1] === "AVG") {
									if (ls_target_franchise !== ls_games[j].split(",")[0] && ls_target_franchise !== ls_games[j].split(",")[1])
										if (ls_games[j].split(",")[1] === "AVG") //IF HOME IS AVG THEN SWAP
											new_ls_games.push(ls_games[j].split(",")[1] + "," + ls_games[j].split(",")[0]);
										else
											new_ls_games.push(ls_games[j]);
								}
								break;
							case 2:
								if (ls_games[j].split(",")[0] === "BYE" || ls_games[j].split(",")[1] === "BYE") {
									if (ls_target_franchise !== ls_games[j].split(",")[0] && ls_target_franchise !== ls_games[j].split(",")[1])
										if (ls_games[j].split(",")[1] === "BYE") //IF HOME IS BYE THEN SWAP
											new_ls_games.push(ls_games[j].split(",")[1] + "," + ls_games[j].split(",")[0]);
										else
											new_ls_games.push(ls_games[j]);
								}
								break;
						}
					}
				}
				ls_games = new_ls_games;
				new_ls_games = null;
				switch_game(ls_games[0].split(",")[1], ls_games[0].split(",")[0]);
				//console.log("ls_reorder_ls_games")
			}
		} // end ls_reorder_ls_games


		////////////////////////////////////////////////////////////////////
		//                   FUNCTION - ls_append_css                     //
		////////////////////////////////////////////////////////////////////
		function ls_append_css() {
			$('head').append('<style>.LS_MainScoreboard .ls_team_name{white-space:nowrap}.ls_other_game .ls_og_full_name,.LS_MainScoreboard .ls_team_name{overflow:hidden;text-overflow:ellipsis}.ls-outer-table td.ls_game_info br{display:none}.ls-outer-table td.ls_game_info br + br{display:block}td.ls_projections span:empty:before{content:"0"}.ls-matchup caption span{max-width:unset!important;display:unset!important}.ls_player_stats div:empty:before{content:"- stats - "}.ls_allplay_final{width:0.625rem;text-align:right;padding-left:0.188rem}.wp_bar div{border-radius:0.5rem;}#TeamWinPctRow td{padding:0.188rem}#winprob_away{float:right;text-align:right;padding: 0 0.188rem;min-width: 1.563rem;min-width: fit-content;}#winprob_home{float:left;text-align:left;padding: 0 0.188rem;min-width: 1.563rem;min-width: fit-content;}h3#ls_error{max-width:37.5rem;margin:0 auto;background:red;color:#fff;padding:0.625rem;border-radius:0.313rem}h3#ls_error a{background:#fff;color:red;padding:0.063rem 0.313rem;border-radius:0.188rem;text-decoration:none;display:block;width:6.25rem;text-align:center;margin:0 auto;}#body_ajax_ls h4,#body_ajax_ls table[style="margin-top: 0.313rem"],#body_ajax_ls #ls_ticker_tab_id,#body_ajax_ls #ls_ticker_tab_id,#ls_ticker_tab_id + p,#body_ajax_ls #ls_ticker_tab_id + p + p,#body_ajax_ls #ls_ticker_tab_id + p + p + p,#body_ajax_ls #myNavigationHolder,#body_ajax_ls #ls_setting_drop,#body_ajax_ls table[style*="margin-top: 0.313rem"],#body_ajax_ls #ls_mfl_notes,#body_ajax_ls #ls_ticker_tab_id,#body_ajax_ls table[style*="margin-top: 0.313rem"] + div.mobile-wrap,#body_ajax_ls table[style="margin-top: 0.313rem"] + div.mobile-wrap{visibility:hidden!important}#other_games > tbody > tr > td{font-size:0}#other_games div.ls_other_game {margin: 0 0.125rem;font-size:0.813rem}#body_ajax_ls #ls-modal-container.hide-overlay .ls-modal-content{display:none}#body_ajax_ls #other_games td.ls_og_cell{font-size:0.813rem}#body_ajax_ls #nfl_games td.ls_box_possession:after{content:"";background-size:0.75rem 0.75rem;height:0.75rem;width:0.75rem;position:absolute;margin-left:0.313rem;top:50%;transform:translateY(-50%)}#body_ajax_ls #nfl_games td.ls_box_possession.ls_has_ball+td,#body_ajax_ls #nfl_games td.ls_box_possession.ls_in_redzone+td{width:5.625rem}#body_ajax_ls #nfl_games td.ls_box_possession.ls_has_ball,#body_ajax_ls #nfl_games td.ls_box_possession.ls_in_redzone{width:2.625rem}#body_ajax_ls #nfl_games td.ls_box_possession.ls_in_redzone:after{background-image:url(https://www.mflscripts.com/ImageDirectory/script-images/goal-post.svg)}#body_ajax_ls #nfl_games td.ls_box_possession.ls_has_ball:after{background-image:url(https://www.mflscripts.com/ImageDirectory/script-images/football.svg)}#body_ajax_ls #nfl_games div.ls_other_game td{padding:0.063rem 0.125rem}#nfl_games td[style="border:none;"]:last-of-type{padding:0!important}div.ls_team_name{font-size:1.25rem!important;line-height:3.125rem}.ls-modal{display:none;position:fixed;z-index:99999;padding-top:1.875rem;left:0;top:0;width:100%;height:100%;overflow:auto}.ls-modal-content{position:relative;margin:auto;padding:0;width:96%;-webkit-animation-name:animatetop;-webkit-animation-duration:.4s;animation-name:animatetop;animation-duration:.4s;margin-bottom:1.875rem;max-width:25rem;border-radius:0.188rem}#ls-modal-content{max-height:31.25rem;overflow-x:auto}@-webkit-keyframes animatetop{from{top:-18.75rem;opacity:0}to{top:0;opacity:1}}@keyframes animatetop{from{top:-18.75rem;opacity:0}to{top:0;opacity:1}}.ls-modal-header{padding:0.188rem;background:none}.ls-modal-header h2{text-align:left;margin:0;padding:0;padding-left:0.313rem;text-transform:uppercase}.ls-modal-header .close{font-size:1.25rem;font-weight:700;position:absolute;right:0.313rem;top:0.313rem;text-align:center;border-radius:0.188rem;padding:0;height:1.375rem;width:1.375rem;line-height:1.375rem}.ls-modal-header .close:hover,.ls-modal-header .close:focus{text-decoration:none;cursor:pointer}.ls-modal-body{padding:0 0.125rem;font-size:0.813rem;padding-bottom:0.063rem}#ls-modal-content li,#ls-modal-content ul{margin:0;padding:0;list-style:none}#ls-modal-content .ls-popup-position-li{font-weight:700;font-size:0.875rem;padding-left:0.313rem}#ls-modal-content .ls-popup-player-li{position:relative;padding-left:0.5rem}#ls-modal-content .ls-popup-player-li:last-child{border:0}#ls-modal-content .ls-popup-stats{font-style:italic;display:block;font-size:0.688rem;line-height:0.688rem;font-weight:400;padding:0.125rem 0;padding-left:0.188rem;max-width:21.875rem}#ls-modal-content span.ls-popup-points{text-indent:0;display:inline;position:absolute;top:50%;-ms-transform:translateY(-50%);transform:translateY(-50%);right:0.313rem;font-weight:700;font-size:0.813rem;border:0}.ls-explain-points-total::before{content:"Total Points :";padding-right:0.313rem}.ls-explain-points-li::before{content:"\\f005";font-family:"Font Awesome 6 Pro";padding-right:0.188rem;margin-left:-1.5em}tr[onclick^="ls_nfl_stats_popup_setup"]{cursor:pointer}div.mobile-wrap.ls-boxscore{padding:0 0.625rem;padding-bottom:0.313rem}.ls_scroller{padding:0.625rem 0;padding-bottom:0.313rem;overflow-x:auto;-webkit-overflow-scrolling:touch}#ls-modal-content span.ls-popup-text{font-style:italic;font-weight:700}.ls-popup-text::before,.ls-popup-icon-wrapper::before{content:"-";padding:0 0.125rem}#ls-modal-content img.ls-popup-icon{max-height:1rem;max-width:5rem}#body_ajax_ls table#roster_away,#body_ajax_ls table#roster_home{table-layout:fixed}#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:6.25rem}#body_ajax_ls td.ls_marquee_value{padding-left:0;padding-right:0}#body_ajax_ls .ls-matchup th:last-of-type,#body_ajax_ls .ls-matchup td:last-of-type{width:3.125rem}.ls_other_game .ls_projections{cursor:pointer}.ls_pace_box .ls_projected{display:none}.hide-overlay{background:none!important}@media only screen and (max-width:26.875em){#ls-modal-content .ls-popup-stats{max-width:17.5rem}}@media only screen and (max-width:22.5em){#ls-modal-content .ls-popup-stats{max-width:12.5rem}}@media only screen and (max-width:20em){#ls-modal-content .ls-popup-stats{max-width:11.25rem}}@media only screen and (max-height:37.5em) and (orientation:landscape){#ls-modal-content{max-height:28.75rem}}@media only screen and (max-height:31.25em) and (orientation:landscape){#ls-modal-content{max-height:22.5rem}}@media only screen and (max-height:28.125em) and (orientation:landscape){#ls-modal-content{max-height:19.375rem}}@media only screen and (max-height:25em) and (orientation:landscape){#ls-modal-content{max-height:16.25rem}}@media only screen and (max-height:21.875em) and (orientation:landscape){#ls-modal-content{max-height:13.125rem}}@media only screen and (max-height:18.75em) and (orientation:landscape){#ls-modal-content{max-height:10rem}}@media only screen and (max-height:15.625em) and (orientation:landscape){#ls-modal-content{max-height:6.875rem}}@media only screen and (max-height:12.5em) and (orientation:landscape){#ls-modal-content{max-height:9.375rem}}@media only screen and (max-width:70em){#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:5rem}}@media only screen and (max-width:60em){#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:3.75rem}}@media only screen and (max-width:55em){#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:2.5rem}}@media only screen and (max-width:48em){#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:8.75rem}}@media only screen and (max-width:33em){#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:5rem}}@media only screen and (max-width:30em){#body_ajax_ls .ls-matchup td.ls_projections,#body_ajax_ls th.ls_projections{width:2.5rem}}@media only screen and (max-width: 30em){.ls_pace_legend_title{display:block}#body_ajax_ls .ls-has-bye #LS_TopTableHolder .LS_ScoreboardTitle,#body_ajax_ls .ls-has-bye #LS_TopTableHolder .prmin{font-size:0.625rem}}@media only screen and (max-width: 25em){.ls_projected{display:block}}#body_ajax_ls #roster_away .no_stats td,#body_ajax_ls #roster_home .no_stats td{padding-bottom:0}#body_ajax_ls .no_stats div.ls_player_stats{display:none!important}</style>');
			if (isAllPlay) {
				$('head').append('<style>#ls_setting_drop,.ls-outer-table,.ls-outer-table+div.mobile-wrap,.ls-outer-table+table{max-width:50rem;margin:0 auto}#body_ajax_ls div.ls_other_game{min-width:7.5rem}#body_ajax_ls .mobile-wrap.ls-matchup,#LS_TopTableHolder div.mobile-wrap{margin:0 auto;margin-bottom:0.625rem}#body_ajax_ls #other_games td.ls_og_cell{font-size:0.813rem}div.ls_team_name{font-size:20pt}#LS_HomeTeamName,#LS_CenterTop{width:50%}#other_games .ls_other_game tr{height:1.5rem}#other_games th{display:none}@media only screen and (max-width: 54.25em){#LS_TopTableHolder #LS_CenterTop,#LS_TopTableHolder .prmin,#LS_TopTableHolder .LS_ScoreboardTitle{display:table-cell}}@media only screen and (min-width:48.1em){#body_ajax_ls .ls-outer-table{table-layout:fixed}#body_ajax_ls #roster_away caption,#roster_home caption{display:none}}@media only screen and (max-width:40em){#LS_TopTableHolder #LS_CenterTop,#LS_TopTableHolder .prmin,#LS_TopTableHolder .LS_ScoreboardTitle{display:none}#LS_HomeTeamName{width:50%}.LS_MainScoreboard{table-layout:auto!important}}@media only screen and (max-width:28.000em){#LS_HomeScore span{font-size:1.875rem;min-width:1.5rem}}@media only screen and (max-width:22.5em){td.ls_projections,th.ls_projections,#ls_pace_wrapper{display:none!important}}</style>');
			} else {
				$('head').append('<style>#body_ajax_ls .ls_proj_points{visibility:hidden;width:0!important;font-size:0!important;color:transparent;border:0!important;padding:0!important}.ls-has-bye #LS_TopTableHolder div.mobile-wrap,.ls-has-bye .mobile-wrap.ls-matchup{margin:0.625rem auto;margin-top:0}#body_ajax_ls .ls-has-bye .ls_players_table td.mobile-view:last-of-type{display:table-cell!important}#body_ajax_ls .ls-has-bye .ls-bye-hide,#body_ajax_ls .ls-has-bye .ls_players_table td.mobile-view:first-of-type{display:none!important}#body_ajax_ls .ls-has-bye #LS_TopTableHolder div.mobile-wrap,#body_ajax_ls .ls-has-bye .ls_players_table div.mobile-wrap.ls-matchup{max-width:40.625rem}.ls-has-bye #LS_HomeTeamName div{opacity:1!important}@media only screen and (max-width: 48em){.ls_players_table td.mobile-view:last-of-type{display:none}#LS_HomeTeamName div{opacity:.3}}@media only screen and (min-width: 48em){#body_ajax_ls .ls_players_table td.mobile-view:last-of-type,#body_ajax_ls .ls_players_table td.mobile-view:first-of-type{display:table-cell!important}#LS_HomeTeamName div,#LS_AwayTeamName div{opacity:1!important}}@media only screen and (max-width: 54.25em){#body_ajax_ls .ls-has-bye #LS_TopTableHolder .LS_ScoreboardTitle,#body_ajax_ls .ls-has-bye #LS_TopTableHolder .prmin{display:table-cell}}</style>');
			}
			// ADD CSS FOR ALL PLAY - PLAYOFF LEAGUES WITH VAR SETTING
			if (isAllPlay && fixedWidthBox) {
				$("head").append('<style>#body_ajax_ls #other_games div.ls_other_game{width:' + setBoxWidth + (useREM ? "rem" : "px") + '!important;min-width:' + setBoxWidth + (useREM ? "rem" : "px") + '!important}</style>');
			}
			ls_trigger_run = ls_trigger_run + 4;
			//console.log("ls_append_css + 4 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_append_css


		////////////////////////////////////////////////////////////////////
		//           FUNCTION - ls_hide_projections(checkbox)             //
		////////////////////////////////////////////////////////////////////
		function ls_hide_projections(checkbox) {
			if (checkbox.checked) {
				$(".ls_projections").attr("style", "display:none");
				localStorage.setItem("ls_includeProjections_" + league_id, "1");
			} else {
				$(".ls_projections").removeAttr("style");
				localStorage.removeItem("ls_includeProjections_" + league_id);
			}
			//console.log("ls_hide_projections"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_hide_projections(checkbox)


		////////////////////////////////////////////////////////////////////
		//           FUNCTION - ls_hide_nfl_boxscore(checkbox)            //
		////////////////////////////////////////////////////////////////////
		function ls_hide_nfl_boxscore(checkbox) {
			if (checkbox.checked) {
				$(".ls-nfl-boxscore").slideToggle('500');
				localStorage.setItem("ls_includeNFLBox_" + league_id, "1");
			} else {
				$(".ls-nfl-boxscore").slideToggle('500');
				localStorage.removeItem("ls_includeNFLBox_" + league_id);
			}
			//console.log("ls_hide_nfl_boxscore"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_hide_nfl_boxscore(checkbox)


		////////////////////////////////////////////////////////////////////
		//              FUNCTION - ls_get_player_projection               //
		////////////////////////////////////////////////////////////////////
		function ls_get_player_projection(pid) {
			try {
				if (ls_nfl_games[ls_player[pid].nfl_team].secs_left === 0)
					if (ls_player[pid] === undefined || isNaN(ls_player[pid].points))
						if (ls_projections['pid_' + pid] === undefined)
							return ({
								"pace": 0,
								"points": 0,
								"projected": 0,
								"formatted": format_points(0),
								"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
							});
						else
							return ({
								"pace": 0,
								"points": 0,
								"projected": parseFloat(ls_projections['pid_' + pid]),
								"formatted": format_points(0),
								"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
							});
				else
				if (ls_projections['pid_' + pid] === undefined)
					return ({
						"pace": ls_player[pid].points,
						"points": ls_player[pid].points,
						"projected": 0,
						"formatted": format_points(ls_player[pid].points),
						"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
					});
				else
					return ({
						"pace": ls_player[pid].points,
						"points": ls_player[pid].points,
						"projected": parseFloat(ls_projections['pid_' + pid]),
						"formatted": format_points(ls_player[pid].points),
						"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
					});
				else if (ls_nfl_games[ls_player[pid].nfl_team].secs_left === 3600)
					if (ls_projections['pid_' + pid] === undefined)
						return ({
							"pace": 0,
							"points": 0,
							"projected": 0,
							"formatted": '',
							"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
						});
					else
						return ({
							"pace": parseFloat(ls_projections['pid_' + pid]),
							"points": 0,
							"projected": parseFloat(ls_projections['pid_' + pid]),
							"formatted": ls_projections['pid_' + pid],
							"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
						});
				else if (ls_projections['pid_' + pid] === undefined)
					return ({
						"pace": ls_player[pid].points,
						"points": (ls_player[pid].points - 0),
						"projected": ls_player[pid].points,
						"formatted": format_points(ls_player[pid].points),
						"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
					});
				else
					return ({
						"pace": (ls_player[pid].points + parseFloat(ls_projections['pid_' + pid]) * (ls_nfl_games[ls_player[pid].nfl_team].secs_left / 3600)),
						"points": ls_player[pid].points,
						"projected": parseFloat(ls_projections['pid_' + pid]),
						"formatted": format_points(ls_player[pid].points + parseFloat(ls_projections['pid_' + pid]) * (ls_nfl_games[ls_player[pid].nfl_team].secs_left / 3600)),
						"game_sec_remaining": ls_nfl_games[ls_player[pid].nfl_team].secs_left
					});
			} catch (er) {
				return ({
					"pace": 0,
					"points": 0,
					"projected": 0,
					"formatted": '',
					"game_sec_remaining": 0
				});
			}
			//console.log("ls_get_player_projection"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_get_player_projection


		////////////////////////////////////////////////////////////////////
		//                  FUNCTION - ls_hideProbability                 //
		////////////////////////////////////////////////////////////////////
		//function ls_hideProbability() {
		//if (ls_show_win_probability) {
		//$("#LS_AwayTeamPercent span div,#LS_HomeTeamPercent span div").filter(function () {
		//return ($(this).text() === "100%" || $(this).text() === "0%" || $(this).text() === "NaN%" || $(this).text() === "N/A");
		//}).closest('td').css("display", "none");}
		//console.log("ls_show_win_probability"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		//} // end ls_hideProbability


		////////////////////////////////////////////////////////////////////
		//                  FUNCTION - ls_update_projections              //
		////////////////////////////////////////////////////////////////////
		function ls_update_projections() {
			//LOOP THROUGH ALL THE ROSTERS AND DO PROJECTIONS
			for (var key in ls_rosters) {
				if (ls_rosters.hasOwnProperty(key)) {
					//UPDATE PROJECTIONS FOR STARTERS AND STARTER TOTALS
					var _pace = 0;
					var _proj = 0;
					var _pts = 0;
					var _gsr = 0;
					if (ls_rosters[key].hasOwnProperty("S")) {
						for (var i = 0; i < ls_rosters[key].S.length; i++) {
							var _return_ar = ls_get_player_projection(ls_rosters[key].S[i]);
							_pace += _return_ar.pace;
							_proj += _return_ar.projected;
							_pts += _return_ar.points;
							_gsr += _return_ar.game_sec_remaining;
							if (ls_orig_proj_when_final && _return_ar.game_sec_remaining === 0) {
								$("#ls_pace_pts_" + ls_rosters[key].S[i]).html('<span class="ls_projected" title="Original Projection">' + format_points(parseFloat(_return_ar.projected)) + '</span>');
								if ((_return_ar.pace - _return_ar.projected) < 0)
									$(".pfpts_" + ls_rosters[key].S[i]).addClass('ls_below_projected');
								else if ((_return_ar.pace - _return_ar.projected) > 0)
									$(".pfpts_" + ls_rosters[key].S[i]).addClass('ls_above_projected');
							} else if ((_return_ar.pace - _return_ar.projected) < 0)
								$("#ls_pace_pts_" + ls_rosters[key].S[i]).html('<span class="ls_below_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else if ((_return_ar.pace - _return_ar.projected) > 0)
								$("#ls_pace_pts_" + ls_rosters[key].S[i]).html('<span class="ls_above_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else
								$("#ls_pace_pts_" + ls_rosters[key].S[i]).html('<span class="ls_at_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
						}
					}
					// UPDATE OTHER GAME PROJECTION TOTALS AND ASSIGN DISPLAYED TEAM TOTALS FOR STARTERS
					ls_pace_tracker["fid_" + key] = ({
						"S": '',
						"NS": '',
						'IR': '',
						'TS': ''
					});
					if (ls_orig_proj_when_final && _gsr === 0) {
						ls_pace_tracker["fid_" + key].S = '<span class="ls_projected" title="Original Projection">' + format_points(_proj) + '</span>';
						if ((_pace - _proj) < 0)
							$(".ogffpts_" + key + ", #ogffpts_" + key).addClass('ls_below_projected');
						else if ((_pace - _proj) > 0)
							$(".ogffpts_" + key + ", #ogffpts_" + key).addClass('ls_above_projected');
					} else if ((_pace - _proj) < 0) {
						ls_pace_tracker["fid_" + key].S = '<span class="ls_below_projected" title="Original Projection: ' + format_points(_proj) + '">' + format_points(_pace) + '</span>';
					} else if ((_pace - _proj) > 0) {
						ls_pace_tracker["fid_" + key].S = '<span class="ls_above_projected" title="Original Projection: ' + format_points(_proj) + '">' + format_points(_pace) + '</span>';
					} else {
						ls_pace_tracker["fid_" + key].S = '<span class="ls_at_projected" title="Original Projection: ' + format_points(_proj) + '">' + format_points(_pace) + '</span>';
					}
					//UPDATE DISPLAYED TEAM TOTALS FOR STARTERS
					$("#ls_pace_" + key + ".ls_projections.ls_projections_S.ffpts_pace_total").html(ls_pace_tracker["fid_" + key].S);
					//UPDATE BOX TEAM TOTALS
					$(".ls_pace_box_" + key).html(ls_pace_tracker["fid_" + key].S);

					//UPDATE PROJECTIONS FOR RESERVES AND RESERVE TOTALS
					var _pace = 0;
					var _proj = 0;
					var _pts = 0;
					var _gsr = 0;
					if (ls_rosters[key].hasOwnProperty("NS")) {
						for (var i = 0; i < ls_rosters[key].NS.length; i++) {
							var _return_ar = ls_get_player_projection(ls_rosters[key].NS[i]);
							_pace += _return_ar.pace;
							_proj += _return_ar.projected;
							_pts += _return_ar.points;
							_gsr += _return_ar.game_sec_remaining;
							if (ls_orig_proj_when_final && _return_ar.game_sec_remaining === 0) {
								$("#ls_pace_pts_" + ls_rosters[key].NS[i]).html('<span class="ls_projected" title="Original Projection">' + format_points(parseFloat(_return_ar.projected)) + '</span>');
								if ((_return_ar.pace - _return_ar.projected) < 0) $(".pfpts_" + ls_rosters[key].NS[i]).addClass('ls_below_projected');
								else if ((_return_ar.pace - _return_ar.projected) > 0) $(".pfpts_" + ls_rosters[key].NS[i]).addClass('ls_above_projected');
							} else if ((_return_ar.pace - _return_ar.projected) < 0)
								$("#ls_pace_pts_" + ls_rosters[key].NS[i]).html('<span class="ls_below_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else if ((_return_ar.pace - _return_ar.projected) > 0)
								$("#ls_pace_pts_" + ls_rosters[key].NS[i]).html('<span class="ls_above_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else
								$("#ls_pace_pts_" + ls_rosters[key].NS[i]).html('<span class="ls_at_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
						}
					}
					// ASSIGN DISPLAYED TEAM TOTALS FOR NON-STARTERS
					ls_pace_tracker["fid_" + key] = ({
						"S": '',
						"NS": '',
						'IR': '',
						'TS': ''
					});
					if (ls_orig_proj_when_final && _gsr === 0) {
						ls_pace_tracker["fid_" + key].NS = '<span class="ls_projected" title="Original Projection">' + format_points(_proj) + '</span>';
					} else if ((_pace - _proj) < 0) {
						ls_pace_tracker["fid_" + key].NS = '<span class="ls_below_projected" title="Original Projection: ' + format_points(_proj) + '">' + format_points(_pace) + '</span>';
					} else if ((_pace - _proj) > 0) {
						ls_pace_tracker["fid_" + key].NS = '<span class="ls_above_projected" title="Original Projection: ' + format_points(_proj) + '">' + format_points(_pace) + '</span>';
					} else {
						ls_pace_tracker["fid_" + key].NS = '<span class="ls_at_projected" title="Original Projection: ' + format_points(_proj) + '">' + format_points(_pace) + '</span>';
					}
					//UPDATE DISPLAYED TEAM TOTALS FOR NON-STARTERS
					$("#ls_pace_" + key + ".ls_projections.ls_projections_NS.ffpts_pace_total").html(ls_pace_tracker["fid_" + key].NS);

					//UPDATE PROJECTIONS FOR INJURED RESERVE
					var _pace = 0;
					var _proj = 0;
					var _pts = 0;
					var _gsr = 0;
					if (ls_rosters[key].hasOwnProperty("IR")) {
						for (var i = 0; i < ls_rosters[key].IR.length; i++) {
							var _return_ar = ls_get_player_projection(ls_rosters[key].IR[i]);
							_pace += _return_ar.pace;
							_proj += _return_ar.projected;
							_pts += _return_ar.points;
							_gsr += _return_ar.game_sec_remaining;
							if (ls_orig_proj_when_final && _return_ar.game_sec_remaining === 0) {
								$("#ls_pace_pts_" + ls_rosters[key].IR[i]).html('<span class="ls_projected" title="Original Projection">' + format_points(parseFloat(_return_ar.projected)) + '</span>');
								if ((_return_ar.pace - _return_ar.projected) < 0)
									$(".pfpts_" + ls_rosters[key].IR[i]).addClass('ls_below_projected');
								else if ((_return_ar.pace - _return_ar.projected) > 0)
									$(".pfpts_" + ls_rosters[key].IR[i]).addClass('ls_above_projected');
							} else if ((_return_ar.pace - _return_ar.projected) < 0)
								$("#ls_pace_pts_" + ls_rosters[key].IR[i]).html('<span class="ls_below_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else if ((_return_ar.pace - _return_ar.projected) > 0)
								$("#ls_pace_pts_" + ls_rosters[key].IR[i]).html('<span class="ls_above_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else
								$("#ls_pace_pts_" + ls_rosters[key].IR[i]).html('<span class="ls_at_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
						}
					}
					//UPDATE PROJECTIONS FOR TAXI SQUAD
					var _pace = 0;
					var _proj = 0;
					var _pts = 0;
					var _gsr = 0;
					if (ls_rosters[key].hasOwnProperty("TS")) {
						for (var i = 0; i < ls_rosters[key].TS.length; i++) {
							var _return_ar = ls_get_player_projection(ls_rosters[key].TS[i]);
							_pace += _return_ar.pace;
							_proj += _return_ar.projected;
							_pts += _return_ar.points;
							_gsr += _return_ar.game_sec_remaining;
							if (ls_orig_proj_when_final && _return_ar.game_sec_remaining === 0) {
								$("#ls_pace_pts_" + ls_rosters[key].TS[i]).html('<span class="ls_projected" title="Original Projection">' + format_points(parseFloat(_return_ar.projected)) + '</span>');
								if ((_return_ar.pace - _return_ar.projected) < 0)
									$(".pfpts_" + ls_rosters[key].TS[i]).addClass('ls_below_projected');
								else if ((_return_ar.pace - _return_ar.projected) > 0)
									$(".pfpts_" + ls_rosters[key].TS[i]).addClass('ls_above_projected');
							} else if ((_return_ar.pace - _return_ar.projected) < 0)
								$("#ls_pace_pts_" + ls_rosters[key].TS[i]).html('<span class="ls_below_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else if ((_return_ar.pace - _return_ar.projected) > 0)
								$("#ls_pace_pts_" + ls_rosters[key].TS[i]).html('<span class="ls_above_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
							else
								$("#ls_pace_pts_" + ls_rosters[key].TS[i]).html('<span class="ls_at_projected" title="Original Projection: ' + format_points(parseFloat(_return_ar.projected)) + '">' + _return_ar.formatted + '</span>');
						}
					}
				}
			}
			//console.log("ls_update_projections"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_update_projections


		////////////////////////////////////////////////////////////////////
		//                 FUNCTION - ls_parse_projections                //
		////////////////////////////////////////////////////////////////////
		function ls_parse_projections() {
			ls_projections = {};
			if (liveScoringWeek < 1) var _liveScoringWeek = 1;
			else var _liveScoringWeek = liveScoringWeek;
			// WE ARE ONLY CACHING PROJECTED SCORES FOR LIVESCORING WEEK. WE WILL NEED TO READ API FOR PREVIOUS WEEKS
			//WE ARE ONLY CACHING PROJECTED SCORES FOR LIVESCORING WEEK.  WE WILL NEED TO READ API FOR PREVIOUS WEEKS
			var property = "w_" + (_liveScoringWeek)
			if (ls_is_live_week) {
				for (var i = 0; i < reportProjectedScores_ar[property].projectedScores.playerScore.length; i++) {
					if (reportProjectedScores_ar[property].projectedScores.playerScore[i].score.length === 0) ls_projections["pid_" + reportProjectedScores_ar[property].projectedScores.playerScore[i].id] = 0;
					else ls_projections["pid_" + reportProjectedScores_ar[property].projectedScores.playerScore[i].id] = reportProjectedScores_ar[property].projectedScores.playerScore[i].score;
				}
			} else {
				fetch(`${baseURLDynamic}/${year}/export?TYPE=projectedScores&L=${league_id}&W=${_liveScoringWeek}&JSON=1`)
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(projectionsData => {
						for (var i = 0; i < projectionsData.projectedScores.playerScore.length; i++) {
							if (projectionsData.projectedScores.playerScore[i].score.length === 0) ls_projections["pid_" + projectionsData.projectedScores.playerScore[i].id] = 0;
							else ls_projections["pid_" + projectionsData.projectedScores.playerScore[i].id] = projectionsData.projectedScores.playerScore[i].score;
						}
					})
					.catch(error => {
						console.error('Error:', error);
					});
			}

			ls_trigger_run += 14;
			//console.log("ls_parse_projections + 14 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE
		} // end ls_parse_projections


		////////////////////////////////////////////////////////////////////
		//                   FUNCTION - ls_parse_injuries                 //
		////////////////////////////////////////////////////////////////////
		function ls_parse_injuries() {
			ls_injuries = new Array();
			for (var i = 0; i < reportInjuries_ar.injuries.injury.length; i++) {
				ls_injuries["pid_" + reportInjuries_ar.injuries.injury[i].id] = ({
					"code": reportInjuries_ar.injuries.injury[i].status.substr(0, 1),
					"status": reportInjuries_ar.injuries.injury[i].status,
					"details": reportInjuries_ar.injuries.injury[i].details
				});
			}
			ls_trigger_run = ls_trigger_run + 17;
			//console.log("ls_parse_injuries + 17 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_parse_injuries


		////////////////////////////////////////////////////////////////////
		//                    FUNCTION - ls_check_if_bye                  //
		////////////////////////////////////////////////////////////////////
		function ls_check_if_bye() {
			// if away team is bye then add bye class to main scoreboard to hide for mobile and activate home team
			//if(ls_away_id==='BYE'||ls_away_id==='AVG') {
			if ($('.ls_other_game_avg.current_matchup,.ls_other_game_bye.current_matchup').length) {
				$("#ajax_ls").addClass("ls-has-bye");
				$("#body_ajax_ls .ls-has-bye .ls_players_table td.mobile-view:last-of-type").attr('colspan', 2);
				$("#body_ajax_ls .ls-has-bye #LS_HomeTeamRecord").attr('colspan', 7);
				$("#body_ajax_ls .ls-has-bye #LS_HomeTeamName").attr('colspan', 7);
				$("#body_ajax_ls .ls-has-bye #LS_HomeScore").attr('colspan', 4);
				$("#body_ajax_ls .ls-has-bye #LS_HomeTeamPercent,#body_ajax_ls .ls-has-bye #LS_AwayTeamPercent").hide();
			} else {
				$("#ajax_ls").removeClass("ls-has-bye");
				$("#body_ajax_ls .ls_players_table td.mobile-view:last-of-type").removeAttr('colspan');
				$("#body_ajax_ls #LS_HomeTeamRecord").removeAttr('colspan');
				$("#body_ajax_ls #LS_HomeTeamName").removeAttr('colspan');
				$("#body_ajax_ls #LS_HomeScore").removeAttr('colspan');
				$("#body_ajax_ls #LS_HomeTeamPercent,#body_ajax_ls #LS_AwayTeamPercent").show();
			}
			//console.log("ls_check_if_bye"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_check_if_bye


		////////////////////////////////////////////////////////////////////
		//                   FUNCTION - ls_check_if_final                 //
		////////////////////////////////////////////////////////////////////
		function ls_check_if_final() {
			if (isAllPlay) {
				$('#other_games .ls_other_game div[class^="oggstat"]:contains("F")').closest('td').replaceWith('<td class="ls_allplay_final"><div>(F)</div></td>');
			} else {
				$('div[id*="og_"]').each(function () {
					top_score = Number($(this).find('tr:first-child div[class*="ogffpts_"]').text());
					bottom_score = Number($(this).find('tr:last-child div[class*="ogffpts_"]').text());
					if ($(this).find('div[class^="oggstat"]:contains("F")').length === 2 || $(this).filter('.ls_other_game_avg').find('div[class^="oggstat"]:contains("F")').length === 1) {
						$(this).addClass('ls_box_gameover');
						if (top_score > bottom_score) {
							$(this).find('tr:first-child td:last').replaceWith('<td class="winner_mark" style="border:none;"><div class="oggstat_9999"><i class="fa-regular fa-caret-left" aria-hidden="true"></i></div></td>');
						} else if (bottom_score > top_score) {
							$(this).find('tr:last-child td:last').replaceWith('<td class="winner_mark" style="border:none;"><div class="oggstat_9999"><i class="fa-regular fa-caret-left" aria-hidden="true"></i></div></td>');
						} else if (bottom_score === top_score) {
							$(this).find('tr:first-child td:last,tr:last-child td:last').replaceWith('<td class="tie_mark" style="border:none;"><div>T</div></td>');
						}
					} else {
						if ($(this).filter('.ls_other_game_bye').find('div[class^="oggstat"]:contains("F")').length === 1) {
							$(this).addClass('ls_box_gameover');
							$(this).find('tr:last-child td:last').replaceWith('<td class="winner_mark" style="border:none;"><div class="oggstat_9999"><i class="fa-regular fa-caret-left" aria-hidden="true"></i></div></td>');
						}
					}
				});
			}
			//console.log("ls_check_if_final"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_check_if_final


		////////////////////////////////////////////////////////////////////
		//                    FUNCTION - ls_format_score                  //
		////////////////////////////////////////////////////////////////////
		function ls_format_score() {
			$(".ls_team_points span,.ls_team_points a").contents().unwrap();
			$(".ls_team_points a:empty").remove();
			var min_digits = 8;
			var use_blanks = true; // IF TRUE USE BLANKS ELSE USE ZERO
			var _awayScore = $("#ffpts_away").text();
			var _homeScore = $("#ffpts_home").text();
			var _oldScore = _awayScore;
			for (var i = min_digits; i > _oldScore.length; i--) {
				if (use_blanks) _awayScore = 'x' + _awayScore;
				else _awayScore = '0' + _awayScore;
			}
			var _oldScore = _homeScore;
			for (var i = min_digits; i > _oldScore.length; i--) {
				if (use_blanks) _homeScore = 'x' + _homeScore;
				else _homeScore = '0' + _homeScore;
			}
			var html = '';
			for (var i = 0; i < _awayScore.length; i++) {
				if (_awayScore.substr(i, 1) === "x") html += '<span class="blank ls_num_' + (i + 1) + '"><a></a></span>';
				else html += '<span class="ls_num_' + (i + 1) + '"><a>' + _awayScore.substr(i, 1) + '</a></span>';
			}
			$("#ffpts_away").html(html);
			html = '';
			for (var i = 0; i < _homeScore.length; i++) {
				if (_homeScore.substr(i, 1) === "x") html += '<span class="blank ls_num_' + (i + 1) + '"><a></a></span>';
				else html += '<span class="ls_num_' + (i + 1) + '"><a>' + _homeScore.substr(i, 1) + '</a></span>';
			}
			$("#ffpts_home").html(html);
			//console.log("ls_format_score"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_format_score


		////////////////////////////////////////////////////////////////////
		//                     FUNCTION - ls_removeIR                     //
		////////////////////////////////////////////////////////////////////
		function ls_removeIR() {
			var _irFound = false;
			var _taxiFound = false;
			$("#roster_away tr.ls_nonstarters").each(function () {
				if ($(this).find("th:first-child").text() === "Injured Reserve") _irFound = true;
				if ($(this).find("th:first-child").text() === "Taxi Squad") _taxiFound = true;
				if (_irFound && !_taxiFound) {
					$(this).remove();
				}
			});
			_irFound = false;
			_taxiFound = false;
			$("#roster_home tr.ls_nonstarters").each(function () {
				if ($(this).find("th:first-child").text() === "Injured Reserve") _irFound = true;
				if ($(this).find("th:first-child").text() === "Taxi Squad") _taxiFound = true;
				if (_irFound && !_taxiFound) {
					$(this).remove();
				}
			});
			for (var key in ls_rosters) {
				if (ls_rosters.hasOwnProperty(key)) {
					ls_rosters[key].IR = new Array();
				}
			}
			//console.log("ls_removeIR"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_removeIR


		////////////////////////////////////////////////////////////////////
		//                     FUNCTION - ls_removeTaxi                   //
		////////////////////////////////////////////////////////////////////
		function ls_removeTaxi() {
			var _taxiFound = false;
			$("#roster_away tr.ls_nonstarters").each(function () {
				if ($(this).find("th:first-child").text() === "Taxi Squad") _taxiFound = true;
				if (_taxiFound) {
					$(this).remove();
				}
			});
			_taxiFound = false;
			$("#roster_home tr.ls_nonstarters").each(function () {
				if ($(this).find("th:first-child").text() === "Taxi Squad") _taxiFound = true;
				if (_taxiFound) {
					$(this).remove();
				}
			});
			for (var key in ls_rosters) {
				if (ls_rosters.hasOwnProperty(key)) {
					ls_rosters[key].TS = new Array();
				}
			}
			//console.log("ls_removeTaxi"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_removeTaxi


		////////////////////////////////////////////////////////////////////
		//                     FUNCTION - switch_game                     //
		////////////////////////////////////////////////////////////////////
		// Anything that needs to run again when user clicks the boxscores matchups , place in here , still need to place on page load as well
		function switch_game(home, away) {
			if (isAllPlay) {
				ls_global_allplay = home;
				ls_onSwitch = true;
				ls_update_all = 1;
				ls_home_id = home;
				show_game(ls_home_id);
				update_scores();
			} else {
				ls_onSwitch = true;
				ls_update_all = 1;
				ls_home_id = home;
				ls_away_id = away;
				show_game(ls_home_id, ls_away_id);
				update_scores();
				ls_check_if_bye();
				// Added to give class to free agent players - gameover at all time
				// change text for win probability in H2H leagues only if visible
				if ($("#winprob_home:visible").length && ls_show_win_probability) {
					$("#LS_CenterTop").html("<span class='hometeam ls-bye-hide'>% WIN HOME</span><span class='awayteam ls-bye-hide'>AWAY WIN %</span>" + ls_scoreboardName);
				} else {
					$("#LS_CenterTop").html("<span class='hometeam ls-bye-hide'>HOME</span><span class='awayteam ls-bye-hide'>AWAY</span>" + ls_scoreboardName);
				}
			}
			$("#LS_AwayTeamName,#LS_AwayTeamRecord,#LS_AwayScore").trigger('click');

			//console.log("switch_game"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end switch_game


		////////////////////////////////////////////////////////////////////
		//              FUNCTION - ls_after_update_scores                 //
		////////////////////////////////////////////////////////////////////
		//YOU CAN NOW ADD WHATEVER YOU WANT HERE AND IT WILL RUN IMMEDIATELY AFTER MFLS' update_scores 
		function ls_after_update_scores() {
			$("#LS_AwayTeamPercent div,#LS_HomeTeamPercent div").each(function () {
				var $this = $(this);
				var percWidth = $this.text();
				if (percWidth === "NaN%") {
					$this.text('50%');
					percWidth = '50%'
				}
				number = parseFloat($(this).text());
				if (number < 50)
					$(this).removeClass('greaterthan').addClass('lessthan');
				if (number > 50)
					$(this).removeClass('lessthan').addClass('greaterthan');
				if (number === 50)
					$(this).removeClass('lessthan').addClass('greaterthan');
				$(this).css('width', percWidth);
			});
			ls_format_score();
			ls_update_nfl_box();
			ls_check_if_final();
			if (ls_includeProjections) ls_update_projections(); //update projections for both other games and rosters
			// Prevent updates on previous weeks
			if (!ls_is_live_week) {
				ls_timeout = 0;
				ls_update_all = 1;

				function reset_ls_timer() {
					return false;
				}
			}
			$('.ls_projections.ls_pace_box:contains("NaN"),.ls_projections.ls_pace_box:contains("undefined")').html('<i class="fa-regular fa-spinner fa-spin" style="font-size:0.875rem" title="Wait..As MFL Prepares Games Starting"></i>');
			$('.ls_projections span:contains("undefined"),.ls_projections span:contains("NaN"),.ls_game_info:contains("NaN"),.ls_game_info:contains("undefined")').html('<i class="fa-regular fa-spinner fa-spin" style="font-size:1.375rem" title="Wait..As MFL Prepares Games Starting"></i>');
			//console.log("ls_after_update_scores"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_after_update_scores


		////////////////////////////////////////////////////////////////////
		//                     FUNCTION - ls_navbar                       //
		////////////////////////////////////////////////////////////////////
		function ls_navbar() {
			var html = '';
			html += '<div id="myNavigationHolder" style="margin-top:0.625rem"><span class="weekly-navbar"><span class="reportnavigationheader">Select Week: </span>';

			var ls_start_week = startWeek;
			var ls_end_week = endWeek;

			if (location.href.indexOf("W=") === -1) {
				if (liveScoringWeek < 1) var _liveScoringWeek = 1;
				else var _liveScoringWeek = liveScoringWeek;
			} else
				var _liveScoringWeek = parseInt(location.href.substr(location.href.indexOf("W=") + 2, 2));
			for (var i = ls_start_week; i <= ls_end_week; i++) {
				if (i < liveScoringWeek)
					html += '<a href="#week' + i + '" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/ajax_ls?L=' + league_id + '&W=' + _liveScoringWeek + '&W2=' + i + '\';"> ' + i + ' </a>';
				else if (i === liveScoringWeek)
					html += '<span class="currentweek"> ' + i + ' </span>';
				else if (i <= _liveScoringWeek)
					html += '<a href="#week' + i + '" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/ajax_ls?L=' + league_id + '&W=' + _liveScoringWeek + '&W2=' + i + '\';"> ' + i + ' </a>';
				else
					html += '<a href="#week' + i + '" class="inactive" style="cursor:default"> ' + i + ' </a>';
			}
			html += '</span>';
			html += '<span class="weekly-navbar-mobile">Select Week: ';
			html += '<select size="1" id="ls_scoreboardWeek" onchange="location.href=\'' + baseURLDynamic + '/' + year + '/ajax_ls?L=' + league_id + '&W=' + _liveScoringWeek + '&W2=\'+document.getElementById(\'ls_scoreboardWeek\').value;">';
			for (var i = ls_start_week; i <= ls_end_week; i++) {
				if (i < liveScoringWeek)
					html += '<option value="' + i + '">' + i + '</option>';
				else if (i === liveScoringWeek)
					html += '<option value="' + i + '" selected="selected">' + i + '</option>';
				else if (i <= _liveScoringWeek)
					html += '<option value="' + i + '">' + i + '</option>';
				else
					html += '<option value="' + i + '" disabled="disabled">' + i + '</option>';
			}
			html += '</select>';
			html += '</span>';
			html += '</div>';
			$("#ls_setting_drop").before(html);
			ls_trigger_run = ls_trigger_run + 11;
			//console.log("ls_navbar + 11 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_update_nfl_records


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - ls_update_nfl_records                 //
		////////////////////////////////////////////////////////////////////
		var ls_nfl_records = new Array();

		function ls_update_nfl_records() {
			for (var w = 1; w < liveScoringWeek; w++) {
				var nflData = reportNflSchedule_ar["w_" + w];
				for (var i = 0; i < nflData.nflSchedule.matchup.length; i++) {
					if (ls_nfl_records[nflData.nflSchedule.matchup[i].team[0].id] === undefined) ls_nfl_records[nflData.nflSchedule.matchup[i].team[0].id] = ({
						w: 0,
						l: 0,
						t: 0
					});
					if (ls_nfl_records[nflData.nflSchedule.matchup[i].team[1].id] === undefined) ls_nfl_records[nflData.nflSchedule.matchup[i].team[1].id] = ({
						w: 0,
						l: 0,
						t: 0
					});
					if (parseInt(nflData.nflSchedule.matchup[i].team[0].score) > parseInt(nflData.nflSchedule.matchup[i].team[1].score)) {
						ls_nfl_records[nflData.nflSchedule.matchup[i].team[0].id].w += 1;
						ls_nfl_records[nflData.nflSchedule.matchup[i].team[1].id].l += 1;
					} else if (parseInt(nflData.nflSchedule.matchup[i].team[0].score) < parseInt(nflData.nflSchedule.matchup[i].team[1].score)) {
						ls_nfl_records[nflData.nflSchedule.matchup[i].team[0].id].l += 1;
						ls_nfl_records[nflData.nflSchedule.matchup[i].team[1].id].w += 1;
					} else {
						ls_nfl_records[nflData.nflSchedule.matchup[i].team[0].id].t += 1;
						ls_nfl_records[nflData.nflSchedule.matchup[i].team[1].id].t += 1;
					}
				}
				nflData = null;
			}
			ls_trigger_run = ls_trigger_run + 12;
			//console.log("ls_update_nfl_records + 12 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_nfl_stats_popup_setup


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - ls_update_nfl_schedule                //
		////////////////////////////////////////////////////////////////////
		function ls_update_nfl_schedule(nflData) {
			for (var i = 0; i < nflData.nflSchedule.matchup.length; i++) {
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[0].id] = [];
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[1].id] = [];
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[0].id].time = parseInt(nflData.nflSchedule.matchup[i].kickoff);
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[0].id].pretty_time = "";
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[0].id].opp = nflData.nflSchedule.matchup[i].team[1].id;
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[0].id].where = 'away';
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[1].id].time = parseInt(nflData.nflSchedule.matchup[i].kickoff);
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[1].id].pretty_time = "";
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[1].id].opp = nflData.nflSchedule.matchup[i].team[0].id;
				ls_nfl_games[nflData.nflSchedule.matchup[i].team[1].id].where = 'home';
			}
			//console.log("ls_update_nfl_schedule"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_update_nfl_schedule


		////////////////////////////////////////////////////////////////////
		//         FUNCTION - ls_update_weekly_results_allplay            //
		////////////////////////////////////////////////////////////////////
		function ls_update_weekly_results_allplay(response) {
			var _homeTeam = "";
			var _missingPlayersMaxLength = 2000;
			var _missingPlayers = [];
			_missingPlayers[0] = '';
			if (response.hasOwnProperty("weeklyResults")) {
				if (response.weeklyResults.hasOwnProperty("franchise")) {
					//THERE MAY BE ONLY ONE FRANCHISE ON BYE SO WE NEED TO CREATE ARRAY
					var franchises = new Array();
					if (response.weeklyResults.hasOwnProperty("id"))
						franchises[0] = response.weeklyResults.franchise;
					else
						franchises = response.weeklyResults.franchise;
					//LOOP THROUGH FRANCHISES
					for (var i = 0; i < franchises.length; i++) {
						if (franchises[i].id !== "BYE") {
							ls_games.push(franchises[i].id);
							if (_homeTeam === "") _homeTeam = franchises[i].id;
							if (typeof franchise_id !== "undefined") {
								if (franchise_id === franchises[i].id) {
									_homeTeam = franchises[i].id;
								}
							}
							ls_rosters[franchises[i].id] = {};
							ls_rosters[franchises[i].id].TS = [];
							ls_rosters[franchises[i].id].IR = [];
							if (ls_best_lineup === 0) {
								ls_rosters[franchises[i].id].S = [];
								ls_rosters[franchises[i].id].NS = [];
							} else {
								ls_rosters[franchises[i].id].R = [];
							}
							try {
								for (var j = 0; j < franchises[i].player.length; j++) {
									switch (franchises[i].player[j].status) {
										case "starter":
											if (ls_best_lineup === 0) ls_rosters[franchises[i].id].S.push(franchises[i].player[j].id);
											else ls_rosters[franchises[i].id].R.push(franchises[i].player[j].id);
											break;
										case "nonstarter":
											if (ls_best_lineup === 0) ls_rosters[franchises[i].id].NS.push(franchises[i].player[j].id);
											else ls_rosters[franchises[i].id].R.push(franchises[i].player[j].id);
											break;
										case "taxisquad": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[franchises[i].id].TS.push(franchises[i].player[j].id);
											break;
										case "injuredreserve": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[franchises[i].id].IR.push(franchises[i].player[j].id);
											break;
									}
									if (franchises[i].player[j].id !== "")
										if (ls_player[franchises[i].player[j].id] === undefined) {
											if (_missingPlayers[_missingPlayers.length - 1].length > _missingPlayersMaxLength) _missingPlayers.push('');
											_missingPlayers[_missingPlayers.length - 1] += franchises[i].player[j].id + ",";
										}
								}
							} catch (er) {}
						}
					}
				}
			}
			if (_missingPlayers[0] !== "") {
				_missingPlayers.forEach(missingPlayer => {
					const url = `${baseURLDynamic}/${year}/export?TYPE=players&L=${league_id}&PLAYERS=${missingPlayer}&DETAILS=&SINCE&JSON=1&rand=${Math.random()}`;
					fetch(url)
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.json();
						})
						.then(playerData => {
							try { //MULTIPLE MISSING PLAYERS
								for (var i = 0; i < playerData.players.player.length; i++) {
									ls_player[playerData.players.player[i].id] = new LSPlayer(playerData.players.player[i].id, playerData.players.player[i].name, playerData.players.player[i].position, playerData.players.player[i].team, playerData.players.player[i].position);
								}
							} catch (er) { //ONE MISSING PLAYER
								ls_player[playerData.players.player.id] = new LSPlayer(playerData.players.player.id, playerData.players.player.name, playerData.players.player.position, playerData.players.player.team, playerData.players.player.position);
							}
						})
						.catch(error => {
							console.error('Error:', error);
						});
				});
			}
			ls_trigger_run = ls_trigger_run + 43;
			//console.log("ls_update_weekly_results_allplay + 43 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE 
		} // end ls_update_weekly_results_allplay 


		////////////////////////////////////////////////////////////////////
		//              FUNCTION - ls_update_weekly_results               //
		////////////////////////////////////////////////////////////////////
		function ls_update_weekly_results(response) {
			var _awayTeam = "";
			var _homeTeam = "";
			var _missingPlayersMaxLength = 2000;
			var _missingPlayers = [];
			_missingPlayers[0] = '';
			if (response.hasOwnProperty("weeklyResults")) {
				if (response.weeklyResults.hasOwnProperty("matchup")) {
					//THERE MAY BE ONLY ONE MATCHUP SO WE NEED TO CREATE ARRAY
					var matchups = new Array();
					if (response.weeklyResults.matchup.hasOwnProperty("franchise"))
						matchups[0] = response.weeklyResults.matchup;
					else
						matchups = response.weeklyResults.matchup;
					//LOOP THROUGH MATCHUPS
					for (var i = 0; i < matchups.length; i++) {
						ls_games.push(matchups[i].franchise[0].id + "," + matchups[i].franchise[1].id);
						if (_awayTeam === "") _awayTeam = matchups[i].franchise[0].id;
						if (_homeTeam === "") _homeTeam = matchups[i].franchise[1].id;
						if (typeof franchise_id !== "undefined") {
							if (franchise_id === matchups[i].franchise[0].id || franchise_id === matchups[i].franchise[1].id) {
								_awayTeam = matchups[i].franchise[0].id;
								_homeTeam = matchups[i].franchise[1].id;
							}
						}
						if (matchups[i].franchise[0].id !== "BYE") {
							ls_rosters[matchups[i].franchise[0].id] = {};
							ls_rosters[matchups[i].franchise[0].id].TS = [];
							ls_rosters[matchups[i].franchise[0].id].IR = [];
							if (ls_best_lineup === 0) {
								ls_rosters[matchups[i].franchise[0].id].S = [];
								ls_rosters[matchups[i].franchise[0].id].NS = [];
							} else {
								ls_rosters[matchups[i].franchise[0].id].R = [];
							}
							try {
								for (var j = 0; j < matchups[i].franchise[0].player.length; j++) {
									switch (matchups[i].franchise[0].player[j].status) {
										case "starter":
											if (ls_best_lineup === 0) ls_rosters[matchups[i].franchise[0].id].S.push(matchups[i].franchise[0].player[j].id);
											else ls_rosters[matchups[i].franchise[0].id].R.push(matchups[i].franchise[0].player[j].id);
											break;
										case "nonstarter":
											if (ls_best_lineup === 0) ls_rosters[matchups[i].franchise[0].id].NS.push(matchups[i].franchise[0].player[j].id);
											else ls_rosters[matchups[i].franchise[0].id].R.push(matchups[i].franchise[0].player[j].id);
											break;
										case "taxisquad": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[matchups[i].franchise[0].id].TS.push(matchups[i].franchise[0].player[j].id);
											break;
										case "injuredreserve": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[matchups[i].franchise[0].id].IR.push(matchups[i].franchise[0].player[j].id);
											break;
									}
									if (matchups[i].franchise[0].player[j].id !== "")
										if (ls_player[matchups[i].franchise[0].player[j].id] === undefined) {
											if (_missingPlayers[_missingPlayers.length - 1].length > _missingPlayersMaxLength) _missingPlayers.push('');
											_missingPlayers[_missingPlayers.length - 1] += matchups[i].franchise[0].player[j].id + ",";
										}
								}
							} catch (er) {}
						}
						if (matchups[i].franchise[1].id !== "BYE") {
							ls_rosters[matchups[i].franchise[1].id] = {};
							ls_rosters[matchups[i].franchise[1].id].TS = [];
							ls_rosters[matchups[i].franchise[1].id].IR = [];
							if (ls_best_lineup === 0) {
								ls_rosters[matchups[i].franchise[1].id].S = [];
								ls_rosters[matchups[i].franchise[1].id].NS = [];
							} else {
								ls_rosters[matchups[i].franchise[1].id].R = [];
							}
							try {
								for (var j = 0; j < matchups[i].franchise[1].player.length; j++) {
									switch (matchups[i].franchise[1].player[j].status) {
										case "starter":
											if (ls_best_lineup === 0) ls_rosters[matchups[i].franchise[1].id].S.push(matchups[i].franchise[1].player[j].id);
											else ls_rosters[matchups[i].franchise[1].id].R.push(matchups[i].franchise[1].player[j].id);
											break;
										case "nonstarter":
											if (ls_best_lineup === 0) ls_rosters[matchups[i].franchise[1].id].NS.push(matchups[i].franchise[1].player[j].id);
											else ls_rosters[matchups[i].franchise[1].id].R.push(matchups[i].franchise[1].player[j].id);
											break;
										case "taxisquad": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[matchups[i].franchise[1].id].TS.push(matchups[i].franchise[1].player[j].id);
											break;
										case "injuredreserve": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[matchups[i].franchise[1].id].IR.push(matchups[i].franchise[1].player[j].id);
											break;
									}
									if (matchups[i].franchise[1].player[j].id !== "")
										if (ls_player[matchups[i].franchise[1].player[j].id] === undefined) {
											if (_missingPlayers[_missingPlayers.length - 1].length > _missingPlayersMaxLength) _missingPlayers.push('');
											_missingPlayers[_missingPlayers.length - 1] += matchups[i].franchise[1].player[j].id + ",";
										}
								}
							} catch (er) {}
						}
					}
				}
				if (response.weeklyResults.hasOwnProperty("franchise")) {
					//THERE MAY BE ONLY ONE FRANCHISE ON BYE SO WE NEED TO CREATE ARRAY
					var franchises = new Array();
					if (response.weeklyResults.hasOwnProperty("id"))
						franchises[0] = response.weeklyResults.franchise;
					else
						franchises = response.weeklyResults.franchise;
					//LOOP THROUGH FRANCHISES
					for (var i = 0; i < franchises.length; i++) {
						ls_games.push("BYE," + franchises[i].id);
						if (_awayTeam === "") _awayTeam = "BYE";
						if (_homeTeam === "") _homeTeam = franchises[i].id;
						if (typeof franchise_id !== "undefined") {
							if (franchise_id === franchises[i].id) {
								_awayTeam = "BYE";
								_homeTeam = franchises[i].id;
							}
						}
						if (franchises[i].id !== "BYE") {
							ls_rosters[franchises[i].id] = {};
							ls_rosters[franchises[i].id].TS = [];
							ls_rosters[franchises[i].id].IR = [];
							if (ls_best_lineup === 0) {
								ls_rosters[franchises[i].id].S = [];

								ls_rosters[franchises[i].id].NS = [];
							} else {
								ls_rosters[franchises[i].id].R = [];
							}
							try {
								for (var j = 0; j < franchises[i].player.length; j++) {
									switch (franchises[i].player[j].status) {
										case "starter":
											if (ls_best_lineup === 0) ls_rosters[franchises[i].id].S.push(franchises[i].player[j].id);
											else ls_rosters[franchises[i].id].R.push(franchises[i].player[j].id);
											break;
										case "nonstarter":
											if (ls_best_lineup === 0) ls_rosters[franchises[i].id].NS.push(franchises[i].player[j].id);
											else ls_rosters[franchises[i].id].R.push(franchises[i].player[j].id);
											break;
										case "taxisquad": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[franchises[i].id].TS.push(franchises[i].player[j].id);
											break;
										case "injuredreserve": //DOESN'T CURRENTLY EXIST IN WEEKLY RESULTS BUT HERE FOR FUTURE
											ls_rosters[franchises[i].id].IR.push(franchises[i].player[j].id);
											break;
									}
									if (franchises[i].player[j].id !== "")
										if (ls_player[franchises[i].player[j].id] === undefined) {
											if (_missingPlayers[_missingPlayers.length - 1].length > _missingPlayersMaxLength) _missingPlayers.push('');
											_missingPlayers[_missingPlayers.length - 1] += franchises[i].player[j].id + ",";
										}
								}
							} catch (er) {}
						}
					}
				}
			}
			//MAKE SURE THAT ALL HISTORICAL GAMES HAVE LS_ROSTERS DEFINED FOR EACH FRANCHISE
			for (var fidKey in franchiseDatabase) {
				if (franchiseDatabase.hasOwnProperty(fidKey) && fidKey !== "fid_0000") {
					if (!ls_rosters.hasOwnProperty(franchiseDatabase[fidKey].id)) {
						ls_rosters[franchiseDatabase[fidKey].id] = {};
						ls_rosters[franchiseDatabase[fidKey].id].TS = [];
						ls_rosters[franchiseDatabase[fidKey].id].IR = [];
						if (ls_best_lineup === 0) {
							ls_rosters[franchiseDatabase[fidKey].id].S = [];
							ls_rosters[franchiseDatabase[fidKey].id].NS = [];
						} else {
							ls_rosters[franchiseDatabase[fidKey].id].R = [];
						}
					}
				}
			}
			if (_missingPlayers[0] !== "") {
				for (var i = 0; i < _missingPlayers.length; i++) {
					fetch(`${baseURLDynamic}/${year}/export?TYPE=players&L=${league_id}&PLAYERS=${_missingPlayers[i]}&DETAILS=&SINCE&JSON=1&rand=${Math.random()}`)
						.then(function (response) {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.json();
						})
						.then(function (playerData) {
							try { //MULTIPLE MISSING PLAYERS
								for (var i = 0; i < playerData.players.player.length; i++) {
									ls_player[playerData.players.player[i].id] = new LSPlayer(playerData.players.player[i].id, playerData.players.player[i].name, playerData.players.player[i].position, playerData.players.player[i].team, playerData.players.player[i].position);
								}
							} catch (er) { //ONE MISSING PLAYER
								ls_player[playerData.players.player.id] = new LSPlayer(playerData.players.player.id, playerData.players.player.name, playerData.players.player.position, playerData.players.player.team, playerData.players.player.position);
							}
						})
						.catch(function (error) {
							console.log('Error:', error.message);
							// Handle the error appropriately
						});
				}
			}
			ls_trigger_run = ls_trigger_run + 43;
			//console.log("ls_update_weekly_results + 43 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE 
		} // end ls_update_weekly_results


		////////////////////////////////////////////////////////////////////
		//                  FUNCTION - ls_update_week                     //
		////////////////////////////////////////////////////////////////////
		function ls_update_week() {
			if (liveScoringWeek < 1) var _liveScoringWeek = 1;
			else var _liveScoringWeek = liveScoringWeek;
			if (isAllPlay) {
				//NEED TO RE-BUILD LS_NFL_GAMES
				ls_nfl_games = [];
				try {
					for (var i = 0; i < reportNflByeWeeks_ar.nflByeWeeks.team.length; i++) {
						ls_nfl_games[reportNflByeWeeks_ar.nflByeWeeks.team[i].id] = [];
						ls_nfl_games[reportNflByeWeeks_ar.nflByeWeeks.team[i].id].time = 0;
						ls_nfl_games[reportNflByeWeeks_ar.nflByeWeeks.team[i].id].opp = "BYE";
					}
				} catch (er) {}

				ls_update_nfl_schedule(reportNflSchedule_ar["w_" + _liveScoringWeek]);

				//NEED TO RE-BUILD LS_GAMES
				ls_games = [];
				ls_rosters = [];
				//WE DO NOT CACHE LIVESCORINGWEEK FOR WEEKLY RESULTS
				if (ls_is_live_week || !reportWeeklyResults_ar.hasOwnProperty("w_" + _liveScoringWeek)) {
					fetch(`${baseURLDynamic}/${year}/export?TYPE=weeklyResults&L=${league_id}&W=${_liveScoringWeek}&DETAILS=1&JSON=1&rand=${Math.random()}`)
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.json();
						})
						.then(data => {
							ls_update_weekly_results_allplay(data);
						})
						.catch(error => {
							console.error('Error:', error);
						});
				} else {
					ls_update_weekly_results_allplay(reportWeeklyResults_ar["w_" + _liveScoringWeek]);
				}
			} else {
				//NEED TO RE-BUILD LS_NFL_GAMES
				ls_nfl_games = [];
				try {
					for (var i = 0; i < reportNflByeWeeks_ar.nflByeWeeks.team.length; i++) {
						ls_nfl_games[reportNflByeWeeks_ar.nflByeWeeks.team[i].id] = [];
						ls_nfl_games[reportNflByeWeeks_ar.nflByeWeeks.team[i].id].time = 0;
						ls_nfl_games[reportNflByeWeeks_ar.nflByeWeeks.team[i].id].opp = "BYE";
					}
				} catch (er) {}

				ls_update_nfl_schedule(reportNflSchedule_ar["w_" + _liveScoringWeek]);

				//NEED TO RE-BUILD LS_GAMES
				ls_games = [];
				ls_rosters = [];
				//WE DO NOT CACHE LIVESCORINGWEEK FOR WEEKLY RESULTS
				if (ls_is_live_week || !reportWeeklyResults_ar.hasOwnProperty(`w_${_liveScoringWeek}`)) {
					fetch(`${baseURLDynamic}/${year}/export?TYPE=weeklyResults&L=${league_id}&W=${_liveScoringWeek}&DETAILS=1&JSON=1&rand=${Math.random()}`)
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.json();
						})
						.then(response => {
							ls_update_weekly_results(response);
						})
						.catch(error => {
							console.error('Error:', error);
						});
				} else {
					ls_update_weekly_results(reportWeeklyResults_ar[`w_${_liveScoringWeek}`]);
				}
			}
			// Prevent updates on previous weeks
			if (!ls_is_live_week) {
				ls_timeout = 0;
				ls_update_all = 1;

				function reset_ls_timer() {
					return false;
				}
			}
			ls_create_nfl_box();
			ls_trigger_run = ls_trigger_run + 55;
			//console.log("ls_update_week + 55 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_update_week


		////////////////////////////////////////////////////////////////////
		//            FUNCTION - ls_create_players_roster                 //
		////////////////////////////////////////////////////////////////////
		//FUNCTIONS USED IN NFL BOX
		var ls_players_nfl = new Array();
		var ls_players_roster = new Array();

		function ls_create_players_roster() {
			for (var key in ls_rosters) {
				if (ls_rosters.hasOwnProperty(key)) {
					try {
						for (var i = 0; i < ls_rosters[key].S.length; i++) ls_players_roster[ls_rosters[key].S[i]] = ({
							fid: key,
							status: "S",
							title: "Starter"
						});
					} catch (er) {}
					try {
						for (var i = 0; i < ls_rosters[key].NS.length; i++) ls_players_roster[ls_rosters[key].NS[i]] = ({
							fid: key,
							status: "NS",
							title: "Non-Starter"
						});
					} catch (er) {}
					try {
						for (var i = 0; i < ls_rosters[key].IR.length; i++) ls_players_roster[ls_rosters[key].IR[i]] = ({
							fid: key,
							status: "IR",
							title: "Fantasy IR"
						});
					} catch (er) {}
					try {
						for (var i = 0; i < ls_rosters[key].TS.length; i++) ls_players_roster[ls_rosters[key].TS[i]] = ({
							fid: key,
							status: "TS",
							title: "Taxi Squad"
						});
					} catch (er) {}
					try {
						for (var i = 0; i < ls_rosters[key].R.length; i++) ls_players_roster[ls_rosters[key].R[i]] = ({
							fid: key,
							status: "R",
							title: "Reserve"
						});
					} catch (er) {}
				}
			}
			ls_trigger_run = ls_trigger_run + 20;
			//console.log("ls_create_players_roster + 20 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_create_players_roster


		////////////////////////////////////////////////////////////////////
		//            FUNCTION - ls_nfl_stats_popup_setup                 //
		////////////////////////////////////////////////////////////////////
		function ls_nfl_stats_popup_setup(nfl) {
			//WE NEED TO HIT PLAYER API TO GET ALL PLAYERS FOR NFL TEAM SINCE MANY ARE UNDEFINED
			if (ls_players_nfl[nfl] === undefined) {
				ls_players_nfl[nfl] = new Array();
				fetch(`${baseURLDynamic}/${year}/export?TYPE=players&L=${league_id}&PLAYERS=&DETAILS=&SINCE&JSON=1&rand=${Math.random()}`)
					.then(function (response) {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('Network response was not OK');
						}
					})
					.then(function (playerData) {
						for (var i = 0; i < playerData.players.player.length; i++) {
							if (playerData.players.player[i].team === nfl) {
								if (ls_team_pos[playerData.players.player[i].position] !== undefined) {
									ls_players_nfl[nfl][playerData.players.player[i].id] = ({
										"name": playerData.players.player[i].name,
										"position": playerData.players.player[i].position,
										"isTeam": ls_team_pos[playerData.players.player[i].position],
										"isDefense": ls_def_pos[playerData.players.player[i].position]
									});
								}
							}
							if (ls_player[playerData.players.player[i].id] === undefined) ls_player[playerData.players.player[i].id] = new LSPlayer(playerData.players.player[i].id, playerData.players.player[i].name, playerData.players.player[i].position, playerData.players.player[i].team, playerData.players.player[i].position);
						}
						ls_nfl_stats_popup(nfl);
					})
					.catch(function (error) {
						// Handle the error here
						console.error('Error:', error);
					});
			} else {
				ls_nfl_stats_popup(nfl)
			}
			//console.log("ls_nfl_stats_popup_setup"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_nfl_stats_popup_setup


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - ls_nfl_stats_popup                    //
		////////////////////////////////////////////////////////////////////
		function ls_nfl_stats_popup(nfl) {
			var content_str = "";
			content_str += '<ul class="ls-popup-position-ul">';
			for (var pos in ls_team_pos) {
				content_str += '<li class="ls-popup-position-li">' + pos + '</li>';
				content_str += '<ul class="ls-popup-player-ul">';
				var position_html = [];
				for (var key in ls_players_nfl[nfl]) {
					if (ls_players_nfl[nfl].hasOwnProperty(key)) {
						if (pos === ls_players_nfl[nfl][key].position) {
							try {
								if (ls_team_pos[pos] === 1 && ls_def_pos[pos] === 1) var stats_str = get_tstats_str(nfl);
								else if (ls_team_pos[pos] === 1 && ls_def_pos[pos] !== 1) var stats_str = get_otstats_str(nfl);
								else var stats_str = get_stats_str(key);
							} catch (er) {
								var stats_str = '';
							}
							if (stats_str !== '') {
								var _points = parseFloat(update_player_points(key));
								var _name = ls_players_nfl[nfl][key].name.substr(ls_players_nfl[nfl][key].name.indexOf(",") + 2, ls_players_nfl[nfl][key].name.length) + ' ' + ls_players_nfl[nfl][key].name.substr(0, ls_players_nfl[nfl][key].name.indexOf(","));
								var _icon = '';
								var _text = '';
								if (ls_players_roster[key] !== undefined) {
									if (ls_popup_status) _name += '<span class="ls-popup-status ls-popup-status-' + ls_players_roster[key].status.toLowerCase() + '" title="' + ls_players_roster[key].title + '">' + ls_players_roster[key].status + '</span>';
									switch (ls_popup_abbrev_name_icon) {
										case 0:
											if (franchiseDatabase["fid_" + ls_players_roster[key].fid].abbrev === '') var _text = '<span class="ls-popup-text">' + franchiseDatabase["fid_" + ls_players_roster[key].fid].name + '</span>';
											else var _text = '<span class="ls-popup-text" title="' + franchiseDatabase["fid_" + ls_players_roster[key].fid].name + '">' + franchiseDatabase["fid_" + ls_players_roster[key].fid].abbrev + '</span>';
											break;
										case 1:
											var _text = '<span class="ls-popup-text">' + franchiseDatabase["fid_" + ls_players_roster[key].fid].name + '</span>';
											break;
										case 2:
											if (franchiseDatabase["fid_" + ls_players_roster[key].fid].icon === '') {
												if (franchiseDatabase["fid_" + ls_players_roster[key].fid].abbrev === '') var _text = '<span class="ls-popup-text">' + franchiseDatabase["fid_" + ls_players_roster[key].fid].name + '</span>';
												else var _text = '<span class="ls-popup-text" title="' + franchiseDatabase["fid_" + ls_players_roster[key].fid].name + '">' + franchiseDatabase["fid_" + ls_players_roster[key].fid].abbrev + '</span>';
											} else var _icon = '<span class="ls-popup-icon-wrapper"><img class="ls-popup-icon" src=' + franchiseDatabase["fid_" + ls_players_roster[key].fid].icon + ' title="' + franchiseDatabase["fid_" + ls_players_roster[key].fid].name + '" alt="" /></span>';
											break;
									}
								}
								position_html.push({
									points: _points,
									html: '<li class="ls-popup-player-li"><span class="ls-popup-points" style="cursor:pointer" title="Click to View Details" onclick="ls_explain_points(\'' + key + '\');$(\'#ls-modal-container\').addClass(\'hide-overlay\')">' + format_points(_points) + '</span> ' + _name + _icon + _text + ' <span class="ls-popup-stats">' + stats_str + '</span></li>'
								});
							}
						}
					}
				}
				//sort hi point-getter to low point-getter
				position_html.sort(function (a, b) {
					return b.points - a.points
				});
				for (var i = 0; i < position_html.length; i++) {
					content_str += position_html[i].html;
				}
				content_str += '</ul>';
			}
			content_str += '</ul>';
			$("#ls-modal-header-content").html('Live Stats for ' + nfl);
			$("#ls-modal-content").html(content_str);
			$("#ls-modal-container").attr('style', 'display:block');
			const scorespop = document.querySelector('#ls-modal-content');
			try {
				bodyScrollLock.disableBodyScroll(scorespop);
			} catch (er) {};
			$('#ls-modal-content').scrollTop(0);
			//console.log("ls_nfl_stats_popup"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_nfl_stats_popup


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - ls_update_nfl_box                     //
		////////////////////////////////////////////////////////////////////
		var ls_nfl_final = 0;
		var ls_nfl_sched = 0;

		function ls_update_nfl_box() {
			for (var key in ls_nfl_games) {
				if (ls_nfl_games.hasOwnProperty(key)) {
					if (ls_nfl_games[key].where === "home") {
						//as games kickoff there is an error in game_status that breaks script so we need to error check
						try { // IGNORE ON ERROR
							var key2 = ls_nfl_games[key].opp;
							var _yardStatus = '';
							var _gameStatus = ls_nfl_games[key].game_status.substring(ls_nfl_games[key].game_status.indexOf('<br>') + 4, ls_nfl_games[key].game_status.length);
							if (_gameStatus.indexOf('<br>') !== -1) {
								_yardStatus = '<div class="ls_down_dist" style="font-size:0.563rem;font-style:italic">' + _gameStatus.substring(_gameStatus.indexOf('<br>') + 4, _gameStatus.length) + '</div>';
								_gameStatus = _gameStatus.substring(0, _gameStatus.indexOf('<br>'));
							}
							var _ptsScored_home = "";
							var _ptsScored_away = "";
							try {
								_ptsScored_home = '<span class="ls-nfl-record" style="font-size:0.625rem;font-style:italic">(' + ls_nfl_records[key].w + '-' + ls_nfl_records[key].l + '-' + ls_nfl_records[key].t + ')</span>';
							} catch (er) {}
							try {
								_ptsScored_away = '<span class="ls-nfl-record" style="font-size:0.625rem;font-style:italic">(' + ls_nfl_records[key2].w + '-' + ls_nfl_records[key2].l + '-' + ls_nfl_records[key2].t + ')</span>';
							} catch (er) {}
							if (ls_tstats.hasOwnProperty(key))
								if (ls_tstats[key].TPS !== undefined) _ptsScored_home = ls_tstats[key].TPS;
							if (ls_tstats.hasOwnProperty(key2))
								if (ls_tstats[key2].TPS !== undefined) _ptsScored_away = ls_tstats[key2].TPS;
							$(".nflgffpts_" + key).html(_ptsScored_home);
							$(".nflgffpts_" + key2).html(_ptsScored_away);
							$("#ls_nfl_box_status_" + key).removeClass('ls_nfl_box_over ls_nfl_box_sched ls_nfl_box_inprog');
							$(".ls_box_possession_" + key).removeClass('ls_nothas_ball ls_in_redzone ls_has_ball');
							$(".ls_box_possession_" + key2).removeClass('ls_nothas_ball ls_in_redzone ls_has_ball');
							if (ls_nfl_games[key].secs_left === 0 || _gameStatus === "Final") {
								$("#ls_nfl_box_status_" + key).addClass('ls_nfl_box_over');
								$(".ls_down_dist_" + key).html("");
								$(".ls_down_dist_" + key2).html("");
							} else if (ls_nfl_games[key].secs_left === 3600) {
								$("#ls_nfl_box_status_" + key).addClass('ls_nfl_box_sched');
							} else {
								$("#ls_nfl_box_status_" + key).addClass('ls_nfl_box_inprog');
								// CHECK ORIGINAL class .game_TEAMABBR FOR POSSESSION THEN APPLY TO NFL BOX
								if ($(".ls-update-box.game_" + key).hasClass("ls_noposs")) {
									$(".ls_box_possession_" + key).addClass("ls_nothas_ball");
									$(".ls_down_dist_" + key).html("");
								}
								if ($(".ls-update-box.game_" + key).hasClass("ls_redzone")) {
									$(".ls_box_possession_" + key).addClass("ls_in_redzone");
									$(".ls_down_dist_" + key).html(_yardStatus);
								}
								if ($(".ls-update-box.game_" + key).hasClass("ls_withposs")) {
									$(".ls_box_possession_" + key).addClass("ls_has_ball");
									$(".ls_down_dist_" + key).html(_yardStatus);
								}
								if ($(".ls-update-box.game_" + key2).hasClass("ls_noposs")) {
									$(".ls_box_possession_" + key2).addClass("ls_nothas_ball");
									$(".ls_down_dist_" + key2).html("");
								}
								if ($(".ls-update-box.game_" + key2).hasClass("ls_redzone")) {
									$(".ls_box_possession_" + key2).addClass("ls_in_redzone");
									$(".ls_down_dist_" + key2).html(_yardStatus);
								}
								if ($(".ls-update-box.game_" + key2).hasClass("ls_withposs")) {
									$(".ls_box_possession_" + key2).addClass("ls_has_ball");
									$(".ls_down_dist_" + key2).html(_yardStatus);
								}
							}
							$("#ls_nfl_box_status_" + key).html(_gameStatus);
							if (_gameStatus === "Final") {
								try {
									if (parseInt(ls_tstats[key].TPS) > parseInt(ls_tstats[key2].TPS)) {
										$(".nflggstat_" + key).html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
										$(".nflggstat_" + key).parent().addClass('winner_mark');
									} else if (parseInt(ls_tstats[key2].TPS) > parseInt(ls_tstats[key].TPS)) {
										$(".nflggstat_" + key2).html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
										$(".nflggstat_" + key2).parent().addClass('winner_mark');
									}
								} catch (er) {}
							}
						} catch (er) {}
					}
				}
			}
			//GAME RE-ORDER LIVE GAME / FUTURE GAME / GAME OVER
			var html_live = '';
			var html_future = '';
			var html_over = '';
			var html_other = '';
			var ls_nfl_final_temp = 0;
			var ls_nfl_sched_temp = 0;
			$("#nfl_games tr td div.ls_other_game").each(function () {
				var _homeId = $(this).attr("id").substr(5, 3);
				var html_temp = '<div id="nflg_' + _homeId + '" class="ls_other_game" style="display:inline-block;margin:0 0.125rem;min-width:6.875rem;cursor:default;width:auto">' + $(this).html() + '</div>';
				switch (ls_nfl_games[_homeId].status) {
					case "INPROG":
						html_live += html_temp;
						break;
					case "OVER":
						html_over += html_temp;
						ls_nfl_final_temp++;
						break;
					case "SCHED":
						html_future += html_temp;
						ls_nfl_sched_temp++;
						break;
					default:
						html_other += html_temp;
				}
			});
			//ONLY RE-ORDER IF NEW GAME HAS GONE FINAL OR NEW GAME HAS STARTED
			if (ls_nfl_final_temp > ls_nfl_final || ls_nfl_sched_temp < ls_nfl_sched) {
				var html = '';
				html += html_live;
				html += html_future;
				html += html_over;
				html += html_other;
				$("#nfl_games tr td").html(html);
				ls_nfl_final = ls_nfl_final_temp;
				ls_nfl_sched = ls_nfl_sched_temp;
			}
			//console.log("ls_update_nfl_box"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_update_nfl_box


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - ls_create_nfl_box                     //
		////////////////////////////////////////////////////////////////////
		function ls_create_nfl_box() {
			var html = '';
			if ($("#hide_nfl_boxscore_cb").is(':checked'))
				html += '<div class="mobile-wrap ls-boxscore ls-nfl-boxscore" style="margin-top: 0.313rem;text-align:center;display:none"><div class="ls_scroller">';
			else
				html += '<div class="mobile-wrap ls-boxscore ls-nfl-boxscore" style="margin-top: 0.313rem;text-align:center"><div class="ls_scroller">';
			html += '<table id="nfl_games" style="table-layout:fixed;font-size:0.813rem" border="0" cellpadding="0" cellspacing="2"><tbody><tr><td>';
			//GAME ORDER LIVE GAME / FUTURE GAME / GAME OVER
			var html_live = '';
			var html_future = '';
			var html_over = '';
			var html_other = '';
			for (var key in ls_nfl_games) {
				if (ls_nfl_games.hasOwnProperty(key)) {
					if (ls_nfl_games[key].where === "home") {
						var key2 = ls_nfl_games[key].opp;
						var html_temp = '';
						html_temp += '<div id="nflg_' + key + '" class="ls_other_game" style="display:inline-block;margin:0 0.125rem;min-width:6.875rem;cursor:default;width:auto">';
						html_temp += '<table border="0" cellspacing="0" cellpadding="0">';
						html_temp += '<tbody>';
						html_temp += '<tr onclick="ls_nfl_stats_popup_setup(\'' + key2 + '\')" title="Live Stats for ' + key2 + '"><td style="position:relative;height:1.375rem" class="ls_og_cell ls_box_possession ls_box_possession_' + key2 + '"><img src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + key2 + '.svg" class="ls_nfl_box_icon" style="height:1.875rem;max-width:1.25rem;max-height:1.25rem;" alt="' + key2 + '" title="' + key2 + '" /><span class="ls-update-box game_' + key2 + '" style="display:none"></span></td><td style="font-size:0.563rem;font-style:italic;text-align:left" class="ls_down_dist_' + key2 + '"></td><td align="right" style="border:none;"><div class="nflgffpts nflgffpts_' + key2 + '">0</div></td><td style="border:none;"><div style="width:0.125rem" class="nflggstat nflggstat_' + key2 + '"></div></td></tr>';
						html_temp += '<tr onclick="ls_nfl_stats_popup_setup(\'' + key + '\')" title="Live Stats for ' + key + '"><td style="position:relative;height:1.375rem" class="ls_og_cell ls_box_possession ls_box_possession_' + key + '"><img src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + key + '.svg" class="ls_nfl_box_icon" style="height:1.875rem;max-width:1.25rem;max-height:1.25rem;" alt="' + key + '" title="' + key + '" /><span class="ls-update-box game_' + key + '" style="display:none"></span></td><td style="font-size:0.563rem;font-style:italic;text-align:left" class="ls_down_dist_' + key + '"></td><td align="right" style="border:none;"><div class="nflgffpts nflgffpts_' + key + '">0</div></td><td style="border:none;"><div style="width:0.125rem" class="nflggstat nflggstat_' + key + '"></div></td></tr>';
						html_temp += '<tr><td class="ls_og_cell_status" colspan="4" style="height:1rem"><span id="ls_nfl_box_status_' + key + '" class="ls_nfl_box_status" style="font-size:0.688rem">Gametime</span></td></tr>';
						html_temp += '</tbody>';
						html_temp += '</table>';
						html_temp += '</div>';
						switch (ls_nfl_games[key].status) {
							case "INPROG":
								html_live += html_temp;
								break;
							case "OVER":
								html_over += html_temp;
								ls_nfl_final++;
								break;
							case "SCHED":
								html_future += html_temp;
								ls_nfl_sched++;
								break;
							default:
								html_other += html_temp;
						}
					}
				}
			}
			html += html_live;
			html += html_future;
			html += html_over;
			html += html_other;
			html += '</td></tr></tbody></table>';
			html += '</div>';
			$(".settings-mobile-wrap").after(html);
			ls_trigger_run = ls_trigger_run + 8;
			//console.log("ls_create_nfl_box + 8 "  + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_create_nfl_box


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - ls_explain_points                     //
		////////////////////////////////////////////////////////////////////
		function ls_explain_points(pid) {
			//$("#ls-modal-container").addClass('hide-overlay');
			var html = '';
			var pos = ls_player[pid].pos;
			if (ls_includeProjections) {
				var gsr = isNaN(ls_nfl_games[ls_player[pid].nfl_team].secs_left) ? 0 : ls_nfl_games[ls_player[pid].nfl_team].secs_left;
				var proj = isNaN(parseFloat(ls_projections['pid_' + pid])) ? 0 : parseFloat(ls_projections['pid_' + pid]);
			}
			var pts = 0;
			ls_explain = "";
			if (ls_team_pos[pos] === 1) {
				var nfl_team = ls_player[pid].nfl_team;
				if (ls_tstats[nfl_team] !== undefined) {
					points = score_player(nfl_team, pos);
				}
			} else if (ls_team_pos[pos] === 0 && ls_stats[pid] !== undefined) {
				points = score_player(pid, pos);
			}
			html += '<div class="ls-explain-points-wrapper" style="padding-left:2.5rem"><div class="ls-explain-points-name" style="font-size:0.875rem;margin-left:-1.25rem;padding-bottom:0.5rem;font-weight:bold">' + ls_player[pid].name + " " + ls_player[pid].nfl_team + " " + ls_player[pid].pos + '</div>';
			if (ls_explain !== "") {
				html += '<ul class="ls-explain-points-ul">';
				var stats = ls_explain.split("|");
				for (i = 0; i < stats.length; i++) {
					if (stats[i] !== "") {
						var fields = stats[i].split(",");
						try {
							pts += parseFloat(fields[2]);
						} catch (er) {}
						html += '<li class="ls-explain-points-li">' + fields[2] + " points for " + fields[1] + " ";
						if (ls_cat_desc[fields[0]] !== undefined) {
							html += ls_cat_desc[fields[0]];
						} else {
							html += fields[0];
						}
						html += "</li>";
					}
				}
				html += '</ul>';
				html += '<div class="ls-explain-points-total" style="font-size:1rem;margin-left:-1.25rem;padding-top:0.5rem;font-weight:bold">' + format_points(pts) + '</div>';
			} else {
				html += '<div class="ls-explain-no-stats">No stats</div>';
			}
			if (ls_includeProjections) {
				var pace = pts + ((gsr / 3600) * proj);
				if ($('input[name="hide_projections"]').is(':checked'))
					html += '<div class="ls_projections" style="display:none">';
				else
					html += '<div class="ls_projections">';
				html += '<hr style="margin:0.625rem 0.313rem 0.625rem -2.25rem;border-color:#555">';
				if (gsr === 3600)
					html += '<div class="ls-explain-points-orig-proj" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Original Proj :</span><span style="display:inline-block;text-align:right;min-width:2.75rem">' + format_points(proj) + '</span></div>';
				else if (gsr === 0) {
					html += '<div class="ls-explain-points-orig-proj" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Original Proj :</span><span style="display:inline-block;text-align:right;min-width:2.75rem">' + format_points(proj) + '</span></div>';
					if ((pts - proj) < 0)
						html += '<div class="ls-explain-points-diff" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Difference :</span><span class="ls_below_projected" style="display:inline-block;text-align:right;min-width:2.75rem">' + format_points(pts - proj) + '</span></div>';
					else
						html += '<div class="ls-explain-points-diff" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Difference :</span><span class="ls_above_projected" style="display:inline-block;text-align:right;min-width:2.75rem">+' + format_points(pts - proj) + '</span></div>';
				} else {
					html += '<div class="ls-explain-points-orig-proj" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Original Proj :</span><span style="display:inline-block;text-align:right;min-width:2.75rem">' + format_points(proj) + '</span></div>';
					html += '<div class="ls-explain-points-pace" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Pace Points :</span><span style="display:inline-block;text-align:right;min-width:2.75rem">' + format_points(pace) + '</span></div>';
					if ((pace - proj) < 0)
						html += '<div class="ls-explain-points-diff" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Difference :</span><span class="ls_below_projected" style="display:inline-block;text-align:right;min-width:2.75rem">' + format_points(pace - proj) + '</span></div>';
					else
						html += '<div class="ls-explain-points-diff" style="font-size:0.75rem;margin-left:-1.25rem;padding-top:0.25rem;font-weight:bold"><span style="display:inline-block;min-width:5.625rem;text-align:right">Difference :</span><span class="ls_above_projected" style="display:inline-block;text-align:right;min-width:2.75rem">+' + format_points(pace - proj) + '</span></div>';
				}
				html += '</div>';
			}
			html += '</div>';

			$("#ls-modal-container-2 #ls-modal-header-content").html('Points Breakdown');
			$("#ls-modal-container-2 #ls-modal-content").html(html);
			$("#ls-modal-container-2").attr('style', 'display:block');
			const scorespop = document.querySelector('#ls-modal-content');
			try {
				bodyScrollLock.disableBodyScroll(scorespop);
			} catch (er) {};
			$('#ls-modal-container-2 #ls-modal-content').scrollTop(0);
			//console.log("ls_explain_points"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_explain_points


		////////////////////////////////////////////////////////////////////
		//               FUNCTION - triggerLiveScoring                    //
		////////////////////////////////////////////////////////////////////
		function triggerLiveScoring() {
			triggerLiveScoring_ran = true;
			if (ls_includeInjuryStatus) ls_parse_injuries(); //ONLY PARSE INJURIES IF ENABLED
			if (ls_includeProjections) ls_parse_projections(); //ONLY PARSE PROJECTIONS IF ENABLED
			if (ls_is_live_week) {
				ls_update_nfl_records(); //ONE TIME CALL TO CREATE NFL RECORDS FOR NFL BOX SCORE
				if (ls_excludeIR) ls_removeIR(); // NEED TO REMOVE PLAYER ON FANTASY IR, IF SET, ON INITIAL LOAD
				if (ls_excludeTaxi) ls_removeTaxi(); // NEED TO REMOVE PLAYER ON TAXI, IF SET, ON INITIAL LOAD
				ls_create_nfl_box();
			} else {
				ls_update_week();
			}
			// Stop highlight on initial page load
			setTimeout("clear_highlights()", 500);
			ls_create_players_roster();

			if (!ls_includeInjuryStatus && !ls_includeProjections) {
				ls_trigger_run = ls_trigger_run + 49;
			} else if (!ls_includeInjuryStatus) {
				ls_trigger_run = ls_trigger_run + 35;
			} else if (!ls_includeProjections) {
				ls_trigger_run = ls_trigger_run + 32;
			} else {
				ls_trigger_run = ls_trigger_run + 18;
			}
			//console.log("triggerLiveScoring + 18 "  + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end triggerLiveScoring


		////////////////////////////////////////////////////////////////////
		//            FUNCTION - liveScoringListenerCheck                 //
		////////////////////////////////////////////////////////////////////
		function liveScoringListenerCheck() {
			if (largeLeagueSB) {
				triggerLiveScoring_count++;
				if (typeof reportDailyFullyLoaded !== "undefined") {
					if (reportFiveMinuteFullyLoaded && reportDailyFullyLoaded) {
						clearInterval(liveScoringListener);
						if (!triggerLiveScoring_ran) triggerLiveScoring();
					}
				}
				if (triggerLiveScoring_count > 50) {
					clearInterval(liveScoringListener);
					console.log("Stop trying Replace Live Scoring after 5 seconds");
					listenerCleared = true;
					$('.ls_loading_message').removeClass('ls_loading_message').addClass('ls_loading_message_offseason');
					$('.ls_loading_message_offseason').replaceWith('<h3 id="ls_error" class="warning h3-menu" style="max-width:31.25rem"><span style="font-size:1.75rem;display:block;text-align:center">Live Scoring has failed to load.</span><br><span style="font-size:1.25rem;display:block;text-align:center">There are 2 different reasons why this has happened.</span><br><span style="font-size:0.875rem;display:block;text-align:left">1. You have accessed this page during the offseason. MFL does not display Live Scores after the season has ended or up to 24 hours before kickoff of week 1 games.</span><br><span style="font-size:0.875rem;display:block;text-align:left">2. The scoring has failed to load for some other reason. Please contact your commissioner or see the MFL support thread located <a href="http://forums.myfantasyleague.com/forums/index.php?showtopic=38170" target="_blank">HERE</a></span></h3>');
					clearInterval(errorMsgCk, errorClassCk, listenerCk);
				}
			} else {
				triggerLiveScoring_count++;
				if (typeof reportDailyFullyLoaded !== "undefined") {
					if (reportFiveMinuteFullyLoaded && reportDailyFullyLoaded) {
						clearInterval(liveScoringListener);
						if (!triggerLiveScoring_ran) triggerLiveScoring();
					}
				}
				if (triggerLiveScoring_count > 200) {
					clearInterval(liveScoringListener);
					console.log("Stop trying Replace Live Scoring after 5 seconds");
					listenerCleared = true;
					$('.ls_loading_message').removeClass('ls_loading_message').addClass('ls_loading_message_offseason');
					$('.ls_loading_message_offseason').replaceWith('<h3 id="ls_error" class="warning h3-menu" style="max-width:31.25rem"><span style="font-size:1.75rem;display:block;text-align:center">Live Scoring has failed to load.</span><br><span style="font-size:1.25rem;display:block;text-align:center">There are 2 different reasons why this has happened.</span><br><span style="font-size:0.875rem;display:block;text-align:left">1. You have accessed this page during the offseason. MFL does not display Live Scores after the season has ended or up to 24 hours before kickoff of week 1 games.</span><br><span style="font-size:0.875rem;display:block;text-align:left">2. The scoring has failed to load for some other reason. Please contact your commissioner or see the MFL support thread located <a href="http://forums.myfantasyleague.com/forums/index.php?showtopic=38170" target="_blank">HERE</a></span></h3>');
					clearInterval(errorMsgCk, errorClassCk, listenerCk);
				}
			}
		} // end liveScoringListenerCheck


		////////////////////////////////////////////////////////////////////
		//                  FUNCTION - ls_setup_html                      //
		////////////////////////////////////////////////////////////////////	
		function ls_setup_html() {
			if (isAllPlay) {
				// MFL Live Scoring Page Formatting
				$('h4:first').remove();
				$('#other_games').wrap('<div class="mobile-wrap ls-boxscore"></div>');
				$('.ls-boxscore #other_games').wrap('<div class="ls_scroller"></div>');
				$('table').has('div.ls-boxscore').addClass('ls-outer-table');
				$('.ls-outer-table').css('margin-top', '0.313rem');
				$('td.mobile-view[valign="middle"]').removeClass().addClass('td-boxscore').unwrap().wrap('<tr></tr>');
				$('td.mobile-view').wrap('</tr><tr class="ls_players_table"></tr>');
				$('td.mobile-view').wrapInner('<div class="mobile-wrap ls-matchup"></div>');
				$('p').wrapAll('<div class="mobile-wrap ls-btm-table"></div>');
				$('div.mobile-wrap > table.ls-outer-table').unwrap();
				$('.ls_marquee_label:contains("Playing")').addClass('playing').text('P');
				$('.ls_marquee_label:contains("Yet"):contains("to"):contains("Play")').addClass('ytp').text('YTP');
				$('.ls_marquee_label:contains("Minutes"):contains("Remaining")').addClass('pmr').text('PMR');
			} else {
				// MFL Live Scoring Page Formatting
				$('h4:first').remove();
				$('#other_games').wrap('<div class="mobile-wrap ls-boxscore"></div>');
				$('.ls-boxscore #other_games').wrap('<div class="ls_scroller"></div>');
				$('table').has('div.ls-boxscore').addClass('ls-outer-table');
				$('.ls-outer-table').css('margin-top', '0.313rem');
				$('td.mobile-view').wrapInner('<div class="mobile-wrap ls-matchup"></div>');
				$('td').has('div.ls-boxscore').css({
					"padding": "0",
					"text-align": "center"
				});
				$('div.mobile-wrap:first table:first').unwrap();
				$('p').wrapAll('<div class="mobile-wrap ls-btm-table"></div>');
				$('div.mobile-wrap > table.ls-outer-table').unwrap();
				$('.ls_marquee_label:contains("Playing")').addClass('playing').text('P');
				$('.ls_marquee_label:contains("Yet"):contains("to"):contains("Play")').addClass('ytp').text('YTP');
				$('.ls_marquee_label:contains("Minutes"):contains("Remaining")').addClass('pmr').text('PMR');
			}
			// REMEMBER CHECK BOX FOR NFL BOXSCORES
			if (localStorage["ls_includeNFLBox_" + league_id] === "1") $("#hide_ticker_cb").parent().append(' | <input type="checkbox" name="hide_nfl_boxscore" checked="checked" id="hide_nfl_boxscore_cb" onclick="ls_hide_nfl_boxscore(this)"> Hide NFL');
			else $("#hide_ticker_cb").parent().append(' | <input type="checkbox" name="hide_nfl_boxscore" id="hide_nfl_boxscore_cb" onclick="ls_hide_nfl_boxscore(this)"> Hide NFL');
			// REMEMBER CHECKBOX FOR PROJECTIONS
			if (ls_includeProjections) {
				if (localStorage["ls_includeProjections_" + league_id] === "1") $("#hide_ticker_cb").parent().append(' | <input type="checkbox" name="hide_projections" checked="checked" id="hide_projections_cb" onclick="ls_hide_projections(this)"> Hide Pace');
				else $("#hide_ticker_cb").parent().append(' | <input type="checkbox" name="hide_projections" id="hide_projections_cb" onclick="ls_hide_projections(this)"> Hide Pace');
			}
			$('<div id="ls_setting_drop"><div class="settings-mobile-wrap"><div class="ls_setting_container"><span class="ls_toggle_settings" style="cursor:pointer;font-size:1rem;padding-left:0.313rem;width:100%;display:block;"><i class="fa-regular fa-gears" aria-hidden="true"></i> Settings</span><div class="ls_append_input" style="display:none;margin-left:0.313rem"></div></div></div></div>').insertBefore('.ls-outer-table');
			$('input#hide_nonstarters_cb').wrap('<div class="hide_bench"></div>').after('<label for="hide_nonstarters_cb">Bench</label>');
			$('input#hide_game_info_cb').wrap('<div class="hide_bench"></div>').after('<label for="hide_game_info_cb">Games</label>');
			$('input#hide_stats_cb').wrap('<div class="hide_bench"></div>').after('<label for="hide_stats_cb">Stats</label>');
			$('input#hide_ticker_cb').wrap('<div class="hide_bench"></div>').after('<label for="hide_ticker_cb">Ticker</label>');
			$('input#hide_nfl_boxscore_cb').wrap('<div class="hide_bench" id="ls_nfl_boxscore_wrapper"></div>').after('<label for="hide_nfl_boxscore_cb">NFL</label>');
			if (ls_includeProjections) $('input#hide_projections_cb').wrap('<div class="hide_bench" id="ls_pace_wrapper"></div>').after('<label for="hide_projections_cb">Pace</label>');
			$('.hide_bench').appendTo('.ls_append_input');
			$('#ls_setting_drop .ls_toggle_settings').on("click", function () {
				$(".ls_append_input").slideToggle('500');
			});
			// Toggle class when player stats not selected to remove padding
			$('input[name="hide_stats"]').on("click", function () {
				$('#roster_away td, #roster_home td').toggleClass('td-pad');
			});
			// Move MFL page bottom notes to live ticker table
			$('<div id="ls_mfl_notes"><div class="ls_update_msg" style="display:inline;text-align:center">Data last updated on: </div> , stats will update roughly every 40 seconds while games are in progress.<br>Stats are unofficial and subject to change. Official results can be viewed on <a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=22" target="_blank">Weekly Results</a></div>').insertAfter('#ls_ticker_tab_id');
			if (ls_orig_proj_when_final) $('#ls_mfl_notes').append('<br><span class="ls_projections ls_pace_legend"><span class="ls_pace_legend_title" style="padding:0 0.188rem">Pace Legend:</span><span class="ls_above_projected" style="padding:0 0.188rem">Above Projected</span><span class="ls_below_projected" style="padding:0 0.188rem">Below Projected</span><span class="ls_at_projected" style="padding:0 0.188rem">At Projected</span><span class="ls_projected" style="padding:0 0.188rem">Original Projection</span></span>');
			$('#last_update').appendTo('.ls_update_msg');
			$('div.ls-btm-table').remove();
			$('tr').has('.ls-matchup').addClass('ls_players_table');
			if (isAllPlay) {
				$('<tr><td id="LS_TopTableHolder"><div class="mobile-wrap"><table class="LS_MainScoreboard" style="table-layout:fixed"><tbody><tr><td colspan="2" rowspan="2" id="LS_CenterTop">Live Scoring</td><td colspan="3" id="LS_HomeTeamName"></td></tr><tr><td colspan="3" id="LS_HomeTeamRecord">0-0-0</td></tr><tr><td colspan="2" rowspan="2" id="LS_HomeScore"></td><td class="LS_ScoreboardTitle" title="Player Minutes Remaining">PMR</td><td class="LS_ScoreboardTitle" title="Players Yet to Play">YTP</td><td class="LS_ScoreboardTitle" title="Players Currently Playing">P</td></tr><tr><td id="LS_HomePMR" class="prmin" title="Player Minutes Remaining"></td><td id="LS_HomeYTP" class="prmin" title="Players Yet to Play"></td><td id="LS_HomePlayers" class="prmin" title="Players Currently Playing"></td></tr></tbody></table></div></td></tr>').insertBefore('.ls_players_table');
			} else if ($("#winprob_home").length && ls_show_win_probability && (liveScoringWeek >= real_ls_week)) {
				$('<tr><td id="LS_TopTableHolder" colspan="2"><div class="mobile-wrap"><table class="LS_MainScoreboard" style="table-layout:fixed"><tbody><tr><td id="LS_AwayTeamName" class="ls-bye-hide"></td><td colspan="6" rowspan="3" id="LS_CenterTop" class="ls-bye-hide"><span class="hometeam ls-bye-hide">% WIN HOME</span><span class="awayteam ls-bye-hide">AWAY WIN %</span></td><td id="LS_HomeTeamName"></td></tr><tr><td id="LS_AwayTeamRecord" class="ls-bye-hide">0-0-0</td><td id="LS_HomeTeamRecord">0-0-0</td></tr><tr id="TeamWinPctRow"><td id="LS_AwayTeamPercent" class="ls-bye-hide"><span class="wp_bar" style="position:relative;display:block"><span style="display:inline-block;margin-left:0.313rem"></span>0%</span></td><td id="LS_HomeTeamPercent"><span class="wp_bar" style="position:relative;display:block"><span style="display:inline-block;margin-left:0.313rem"></span>0%</div></span></td></tr><tr><td rowspan="2" id="LS_AwayScore" class="ls-bye-hide"></td><td class="LS_ScoreboardTitle ls-bye-hide" title="Players Currently Playing">P</td><td class="LS_ScoreboardTitle ls-bye-hide" title="Players Yet to Play">YTP</td><td class="LS_ScoreboardTitle ls-bye-hide" title="Player Minutes Remaining">PMR</td><td class="LS_ScoreboardTitle" title="Player Minutes Remaining">PMR</td><td class="LS_ScoreboardTitle" title="Players Yet to Play">YTP</td><td class="LS_ScoreboardTitle" title="Players Currently Playing">P</td><td rowspan="2" id="LS_HomeScore"></td></tr><tr><td id="LS_AwayPlayers" class="prmin ls-bye-hide" title="Players Currently Playing"></td><td id="LS_AwayYTP" class="prmin ls-bye-hide" title="Players Yet to Play"></td><td id="LS_AwayPMR" class="prmin ls-bye-hide" title="Player Minutes Remaining"></td><td id="LS_HomePMR" class="prmin" title="Player Minutes Remaining"></td><td id="LS_HomeYTP" class="prmin" title="Players Yet to Play"></td><td id="LS_HomePlayers" class="prmin" title="Players Currently Playing"></td></tr></tbody></table></div></td></tr>').insertBefore('.ls_players_table');
			} else {
				$('<tr><td id="LS_TopTableHolder" colspan="2"><div class="mobile-wrap"><table class="LS_MainScoreboard" style="table-layout:fixed"><tbody><tr><td id="LS_AwayTeamName" class="ls-bye-hide"></td><td colspan="6" rowspan="2" id="LS_CenterTop" class="ls-bye-hide"><span class="hometeam ls-bye-hide">HOME</span><span class="awayteam ls-bye-hide">AWAY</span></td><td id="LS_HomeTeamName"></td></tr><tr><td id="LS_AwayTeamRecord" class="ls-bye-hide">0-0-0</td><td id="LS_HomeTeamRecord">0-0-0</td></tr><tr><td rowspan="2" id="LS_AwayScore" class="ls-bye-hide"></td><td class="LS_ScoreboardTitle ls-bye-hide" title="Players Currently Playing">P</td><td class="LS_ScoreboardTitle ls-bye-hide" title="Players Yet to Play">YTP</td><td class="LS_ScoreboardTitle ls-bye-hide" title="Player Minutes Remaining">PMR</td><td class="LS_ScoreboardTitle" title="Player Minutes Remaining">PMR</td><td class="LS_ScoreboardTitle" title="Players Yet to Play">YTP</td><td class="LS_ScoreboardTitle" title="Players Currently Playing">P</td><td rowspan="2" id="LS_HomeScore"></td></tr><tr><td id="LS_AwayPlayers" class="prmin ls-bye-hide" title="Players Currently Playing"></td><td id="LS_AwayYTP" class="prmin ls-bye-hide" title="Players Yet to Play"></td><td id="LS_AwayPMR" class="prmin ls-bye-hide" title="Player Minutes Remaining"></td><td id="LS_HomePMR" class="prmin" title="Player Minutes Remaining"></td><td id="LS_HomeYTP" class="prmin" title="Players Yet to Play"></td><td id="LS_HomePlayers" class="prmin" title="Players Currently Playing"></td></tr></tbody></table></div></td></tr>').insertBefore('.ls_players_table');
			}
			if (isAllPlay) {
				$('#LS_TopTableHolder #LS_HomeTeamName').append($('#ficon_home'));
				$('#LS_TopTableHolder #LS_HomeTeamName').append($('#fname_home'));
				$('#LS_TopTableHolder #LS_HomeScore').append($('#ffpts_home'));
				$('#LS_TopTableHolder #LS_HomePlayers').append($('#playing_home'));
				$('#LS_TopTableHolder #LS_HomeYTP').append($('#ytp_home'));
				$('#LS_TopTableHolder #LS_HomePMR').append($('#pmr_home'));
				if (ls_scoreboardName) {
					$("#LS_CenterTop").html(ls_scoreboardName);
				}
				if ($('#LS_HomeTeamRecord:empty')) {
					$('#LS_HomeTeamRecord').closest('tr').remove();
					$('#LS_CenterTop').attr('rowspan', '1');
				}
			} else {
				$('#LS_TopTableHolder #LS_AwayTeamName').append($('#ficon_away'));
				$('#LS_TopTableHolder #LS_HomeTeamName').append($('#ficon_home'));
				$('#LS_TopTableHolder #LS_AwayTeamName').append($('#fname_away'));
				$('#LS_TopTableHolder #LS_HomeTeamName').append($('#fname_home'));
				$('#LS_TopTableHolder #LS_AwayScore').append($('#ffpts_away'));
				$('#LS_TopTableHolder #LS_HomeScore').append($('#ffpts_home'));
				$('#LS_TopTableHolder #LS_AwayPlayers').append($('#playing_away'));
				$('#LS_TopTableHolder #LS_HomePlayers').append($('#playing_home'));
				$('#LS_TopTableHolder #LS_AwayYTP').append($('#ytp_away'));
				$('#LS_TopTableHolder #LS_HomeYTP').append($('#ytp_home'));
				$('#LS_TopTableHolder #LS_AwayPMR').append($('#pmr_away'));
				$('#LS_TopTableHolder #LS_HomePMR').append($('#pmr_home'));

				$('#LS_AwayTeamName,#LS_AwayTeamRecord,#LS_AwayScore').on("click", function () {
					$('.ls_players_table td.mobile-view:last-of-type').css("display", "none");
					$('.ls_players_table td.mobile-view:first-of-type').css("display", "table-cell");
					$('#LS_AwayTeamName div').css("opacity", "1");
					$('#LS_HomeTeamName div').css("opacity", ".3");
				});
				$('#LS_HomeTeamName,#LS_HomeTeamRecord,#LS_HomeScore').on("click", function () {
					$('.ls_players_table td.mobile-view:first-of-type').css("display", "none");
					$('.ls_players_table td.mobile-view:last-of-type').css("display", "table-cell");
					$('#LS_HomeTeamName div').css("opacity", "1");
					$('#LS_AwayTeamName div').css("opacity", ".3");
				});
				if (ls_scoreboardName) {
					$("#LS_CenterTop").html("<span class='hometeam ls-bye-hide'>HOME</span><span class='awayteam ls-bye-hide'>AWAY</span>" + ls_scoreboardName);
				}
			}

			if (ls_show_win_probability) {
				$('#LS_TopTableHolder #LS_AwayTeamPercent span').html($('#winprob_away'));
				$('#LS_TopTableHolder #LS_HomeTeamPercent span').html($('#winprob_home'));
			}

			if (!showTeamName) {
				$("#fname_away,#fname_home").css('display', 'none');
			}
			if (!showTeamIcon) {
				$("#ficon_away,#ficon_home").css('display', 'none');
			}
			//SIMPLE MODAL
			$("body").append('<div id="ls-modal-container" class="ls-modal"><div class="ls-modal-content"><div class="ls-modal-header"><span class="close" onclick="$(\'#ls-modal-container\').removeAttr(\'style\');const scorespop = document.querySelector(\'#ls-modal-content\');try{bodyScrollLock.enableBodyScroll(scorespop);}catch(er){}">X</span><h2 id="ls-modal-header-content"></h2></div><div class="ls-modal-body"><p id="ls-modal-content"></p></div></div></div><div id="ls-modal-container-2" class="ls-modal"><div class="ls-modal-content"><div class="ls-modal-header"><span class="close" onclick="if($(\'.hide-overlay\').is(\':visible\')){}else{const scorespop = document.querySelector(\'#ls-modal-content\');try {bodyScrollLock.enableBodyScroll(scorespop);} catch(er) {};};$(\'#ls-modal-container-2\').removeAttr(\'style\');$(\'#ls-modal-container\').removeClass(\'hide-overlay\')">X</span><h2 id="ls-modal-header-content"></h2></div><div class="ls-modal-body"><p id="ls-modal-content"></p></div></div></div>');

			$("#ls-modal-container").on("click", function () {
				$("#ls-modal-container").css('display', 'none');
				const scorespop = document.querySelector('#ls-modal-content');
				try {
					bodyScrollLock.enableBodyScroll(scorespop);
				} catch (er) {};
			});
			$("#ls-modal-container-2").on("click", function () {
				if ($('.hide-overlay').is(':visible')) {
					//DO NOTHING
				} else {
					const scorespop = document.querySelector('#ls-modal-content');
					try {
						bodyScrollLock.enableBodyScroll(scorespop);
					} catch (er) {};
				}
				$("#ls-modal-container-2").css('display', 'none');
				$('#ls-modal-container').removeClass('hide-overlay');
			});

			$(".ls-modal-content").on("click", function (e) {
				e.stopPropagation();
			});
			ls_trigger_run = ls_trigger_run + 21;
			//console.log("ls_setup_html + 21 " + ls_trigger_run); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_setup_html


		////////////////////////////////////////////////////////////////////
		//            REWRITE MFL FUNCTION - update_scores                //
		////////////////////////////////////////////////////////////////////
		update_scores = (function () {
			var cached_function = update_scores;
			return function () {
				cached_function.apply(this, arguments);
				if (ls_onSwitch) {
					ls_after_update_scores();
				}
			};
		}()); // end update_scores


		////////////////////////////////////////////////////////////////////
		//            REWRITE MFL FUNCTION - init_marquee                 //
		////////////////////////////////////////////////////////////////////
		function init_marquee(which, fid) {
			var fidkey = "fid_" + fid;
			var icon = "";
			if (fid === 'BYE' || fid === 'AVG') {
				if (fid == 'BYE') {
					load_elem("fname_" + which, "BYE");
					update_field("ffpts_" + which, "&nbsp;");
				} else {
					load_elem("fname_" + which, "Average");
					ls_avg_field = "ffpts_" + which;
					ls_do_avg = 1;
					update_field(ls_avg_field, "&nbsp;");
				}
				load_elem("ficon_" + which, "&nbsp;");
				update_field("playing_" + which, "&nbsp;");
				update_field("ytp_" + which, "&nbsp;");
				update_field("pmr_" + which, "&nbsp;");
			} else if (franchiseDatabase[fidkey].icon != undefined) {
				if (franchiseDatabase[fidkey].icon.length > 1) {
					icon = '<img src="' + franchiseDatabase[fidkey].icon +
						'" ' + ls_icon_dim + ' id="franchiseicon_' + fid +
						'" class="franchiseicon" />';
				}
				load_elem("ficon_" + which, icon);
				load_elem("fname_" + which, franchiseDatabase[fidkey].name);
				if (which === "away") {
					load_elem("LS_AwayTeamRecord", ls_records[fid]);
				}
				if (which === "home") {
					load_elem("LS_HomeTeamRecord", ls_records[fid]);
				}
				update_field("ffpts_" + which, format_points(ls_fran_totals[fid].total));
				update_field("playing_" + which, ls_fran_totals[fid].playing);
				update_field("ytp_" + which, ls_fran_totals[fid].ytp);
				update_field("pmr_" + which, format_time_rem(ls_fran_totals[fid].pmr));
				//update_field("proj_" + which, ls_fran_totals[fid].proj);
			}
		} // end init_marquee


		////////////////////////////////////////////////////////////////////
		//         REWRITE MFL FUNCTION - update_game_status              //
		////////////////////////////////////////////////////////////////////
		function update_game_status(team) {
			var opp = ls_nfl_games[team].opp;
			if (liveScoringWeek < 1) var _liveScoringWeek = 1;
			else var _liveScoringWeek = liveScoringWeek;
			var game_status = '<table style="border:0!important;border-spacing:0;box-shadow:none!important;padding:0;width:auto;margin:0 auto"><tbody>';
			var poss_class = "";
			var custom_game_status_class = ""; //NEW ADDITION HERE AND ALL OCCURRENCES BELOW
			var custom_is_half = false; //NEW ADDITION HERE AND ALL OCCURRENCES BELOW
			if (ls_nfl_games[team].time === 0) {
				game_status = '<table style="border:0!important;border-spacing:0;box-shadow:none!important;padding:0;margin:0;width:100%"><tbody><tr><td style="text-align:center;border:0!important;padding:0;margin:0;box-shadow:none!important">BYE</td></tr></tbody></table>';
				ls_nfl_games[team].secs_left = 0;
				ls_nfl_games[team].status = "BYE";
				custom_game_status_class = "no_stats";
			} else if (ls_nfl_games[team].time > ls_last_update_secs) {
				if (ls_nfl_games[team].where === 'away') {
					game_status = game_status + '<tr><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:right"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + team + '.svg" class="ls_nfl_icon"></td><td style="border:0!important;margin:0;box-shadow:none!important;text-align:center;padding:0 0.25rem;font-style:normal;font-size:0.75rem">&#64;</td><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:left"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + opp + '.svg" class="ls_nfl_icon"></td></tr>';
				} else {
					game_status = game_status + '<tr><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:right"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + opp + '.svg" class="ls_nfl_icon"></td><td style="border:0!important;margin:0;box-shadow:none!important;text-align:center;padding:0 0.25rem;font-style:normal;font-size:0.75rem">vs</td><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:left"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + team + '.svg" class="ls_nfl_icon"></td></tr>';

				}
				game_status = game_status + '</tbody></table><br>' + ls_nfl_games[team].pretty_time;
				ls_nfl_games[team].secs_left = 3600;
				ls_nfl_games[team].status = "SCHED";
				custom_game_status_class = "ls_gameis_scheduled";
			} else if (ls_tstats[team] === undefined) {
				//console.log("team stats for " + team + " is undefined");
				return;
			} else if (ls_tstats[opp] === undefined) {
				//console.log("team stats for " + opp + " is undefined");
				return;
			} else {
				if (ls_tstats[team].TPS === undefined) {
					ls_tstats[team].TPS = 0;
				}
				if (ls_tstats[opp].TPS === undefined) {
					ls_tstats[opp].TPS = 0;
				}
				if (ls_nfl_games[team].where === 'away') {
					game_status = game_status + '<tr><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:right"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + team + '.svg" class="ls_nfl_icon"></td><td style="border:0!important;padding:0 0.188rem;font-size:0.875rem;font-weight:bold;font-style:normal;margin:0;box-shadow:none!important;text-align:center">' + ls_tstats[team].TPS + '</td><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;text-align:center;font-style:normal;font-size:0.75rem">&#64;</td><td style="border:0!important;padding:0 0.188rem;font-size:0.875rem;font-weight:bold;font-style:normal;margin:0;box-shadow:none!important;text-align:center">' + ls_tstats[opp].TPS + '</td><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:left"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + opp + '.svg" class="ls_nfl_icon"></td></tr>';
				} else {
					game_status = game_status + '<tr><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:right"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + opp + '.svg" class="ls_nfl_icon"></td><td style="border:0!important;padding:0 0.188rem;font-size:0.875rem;font-weight:bold;font-style:normal;margin:0;box-shadow:none!important;text-align:center">' + ls_tstats[opp].TPS + '</td><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;text-align:center;font-style:normal;font-size:0.75rem">vs</td><td style="border:0!important;padding:0 0.188rem;font-size:0.875rem;font-weight:bold;font-style:normal;margin:0;box-shadow:none!important;text-align:center">' + ls_tstats[team].TPS + '</td><td style="border:0!important;padding:0;margin:0;box-shadow:none!important;width:1.5rem;height:1.25rem;text-align:left"><img style="margin:0;max-height:1.25rem;max-width:1.25rem" src="https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/' + team + '.svg" class="ls_nfl_icon"></td></tr>';
				}
				game_status = game_status + '</tbody></table><br>';
				if (ls_tstats[team].QUARTER == '' || ls_tstats[team].QUARTER === 'F') {
					ls_nfl_games[team].secs_left = 0;
					ls_nfl_games[team].status = "OVER";
					game_status = game_status + "Final";
					custom_game_status_class = "ls_gameis_over";
				} else {
					custom_game_status_class = "ls_gameinprogress";
					poss_class = "ls_noposs";
					var when;
					ls_nfl_games[team].status = "INPROG";
					var parts = ls_tstats[team].REMAINING.split(":");
					ls_nfl_games[team].secs_left = parts[0] * 60 + Number(parts[1]);
					if (ls_tstats[team].QUARTER === 'O' || ls_tstats[team].QUARTER > 4) {
						when = "OT";
					} else if (ls_tstats[team].QUARTER === 'H') {
						when = "H";
						ls_nfl_games[team].secs_left += 15 * 60 * 2;
						custom_is_half = true;
					} else {
						ls_nfl_games[team].secs_left += 15 * 60 * (4 - ls_tstats[team].QUARTER);
						when = ls_tstats[team].QUARTER + "Q";
					}
					when = when + "&nbsp;" + ls_tstats[team].REMAINING;

					var down = ls_tstats[team].DOWN;
					if (down === undefined || down === 0) {
						down = 1;
					}
					if (down === 1) {
						down = down + "st";
					} else if (down === 2) {
						down = down + "nd";
					} else if (down === 3) {
						down = down + "rd";
					} else if (down === 4) {
						down = down + "th";
					}
					game_status = game_status + when;
					if (ls_tstats[team].YARDLINE !== undefined && ls_tstats[team].YARDLINE !== "") {
						var fieldpos = ls_tstats[team].YARDLINE.split(":");
						var side = fieldpos[0];
						var yardline = Number(fieldpos[1]);
						if (side == '50') {
							side = "";
							yardline = 50;
						}
						if (ls_tstats[team].TOGO !== undefined && ls_tstats[team].TOGO !== "") {
							var downdist = down + "&nbsp;and&nbsp;" + ls_tstats[team].TOGO + " at " + side + "&nbsp;" + yardline;
							game_status = game_status + '<br>' + downdist;
							if (ls_tstats[team].POSSESSION > 0) {
								poss_class = "ls_withposs";
								//console.log(team + " poss=" + ls_tstats[team].POSSESSION + " yard=" + ls_tstats[team].YARDLINE + " " + side + " " + yardline);
								if (side !== team && yardline < 20) {
									poss_class = "ls_redzone";
								}
							}
						}
					}
				}
			}
			//NEW ADDITION update game status using value of custom_game_status_class
			if (custom_game_status_class === "no_stats") {
				$(".ls_players_table div.game_" + team).closest('tr').removeClass('ls_nothas_ball ls_in_redzone ls_gameinprogress ls_has_ball').addClass('ls_gameis_over no_stats');
				$(".ls_players_table div[class*='game_FA']").closest('tr').removeClass('ls_nothas_ball ls_in_redzone ls_gameinprogress ls_has_ball').addClass('ls_gameis_over no_stats');
				$(".ls_players_table div[class*='game_FA']").html('<table style="border:0!important;border-spacing:0;box-shadow:none!important;padding:0;margin:0;width:100%"><tbody><tr><td style="text-align:center;border:0!important;padding:0;margin:0;box-shadow:none!important">NO MATCHUP</td></tr></tbody></table>');
			} else if (custom_game_status_class === "ls_gameis_over") {
				$(".ls_players_table div.game_" + team).closest('tr').removeClass('ls_nothas_ball ls_in_redzone ls_gameinprogress ls_has_ball').addClass('ls_gameis_over');
			} else if (custom_game_status_class === "ls_gameinprogress")
				$(".ls_players_table div.game_" + team).closest('tr').removeClass('ls_gameis_scheduled ls_gameis_over').addClass('ls_gameinprogress');
			else if (custom_game_status_class === "ls_gameis_scheduled")
				$(".ls_players_table div.game_" + team).closest('tr').removeClass('ls_nothas_ball ls_in_redzone ls_has_ball ls_gameinprogress ls_gameis_over').addClass("class", "ls_gameis_scheduled");
			if (custom_is_half)
				$(".ls_players_table div.game_" + team).closest('tr').closest('tr').removeClass('ls_nothas_ball ls_in_redzone ls_has_ball');
			//END NEW ADDITION 
			ls_nfl_games[team]["game_status"] = game_status;
			update_field_by_class("game_" + team, game_status, 1);
			update_class_by_class("game_" + team, poss_class);
		} // end update_game_status


		////////////////////////////////////////////////////////////////////
		//        REWRITE MFL FUNCTION - update_class_by_class            //
		////////////////////////////////////////////////////////////////////
		function update_class_by_class(classid, new_class) {
			var ellist = document.getElementsByClassName(classid);
			for (var i = 0; i < ellist.length; i++) {
				if (ellist[i]) {
					if (new_class !== "ls_redzone") {
						removeClass(ellist[i], "ls_redzone");
					}
					if (new_class !== "ls_withposs") {
						removeClass(ellist[i], "ls_withposs");
					}
					if (new_class !== "ls_noposs") {
						removeClass(ellist[i], "ls_noposs");
					}
					if (new_class !== undefined && new_class !== "") {
						addClass(ellist[i], new_class);
					}
				}
			}
			//NEW ADDITION update possession status 
			if (new_class === "ls_withposs")
				$(".ls_players_table div." + classid).closest('tr').removeClass('ls_nothas_ball ls_in_redzone').addClass('ls_has_ball');
			else if (new_class === "ls_noposs")
				$(".ls_players_table div." + classid).closest('tr').removeClass('ls_has_ball ls_in_redzone').addClass('ls_nothas_ball');
			else if (new_class === "ls_redzone")
				$(".ls_players_table div." + classid).closest('tr').addClass('ls_in_redzone');
			$('td.ls_game_info:contains("0:00")').closest('tr').removeClass('ls_has_ball ls_withposs ls_redzone ls_nothas_ball');
		} // end update_class_by_class


		////////////////////////////////////////////////////////////////////
		//           REWRITE MFL FUNCTION - build_other_games             //
		////////////////////////////////////////////////////////////////////
		function build_other_games(home, away) {
			//NOTE: FOR ALL PLAY LEAGUES home & away ARE UNDEFINED
			var html;
			var game_ord = [];
			var current_matchup = 0;
			for (var i = 0; i < ls_games.length; i++) {
				game_ord[i] = i;
				if (!ls_vert_og)
					if (ls_games[i].split(",")[1] === home && ls_games[i].split(",")[0] === away) current_matchup = i;
			}
			if (ls_vert_og) {
				// sort the teams by points scored
				game_ord.sort(function (a, b) {
					var afid = ls_games[a];
					var bfid = ls_games[b];
					var apts = ls_fran_totals[afid] == undefined ? 0 : ls_fran_totals[afid].total;
					var bpts = ls_fran_totals[bfid] == undefined ? 0 : ls_fran_totals[bfid].total;
					if (afid === ls_target_franchise) { //KEEP MY FRANCHISE ON TOP
						return -1;
					} else if (bfid === ls_target_franchise) { //MOVE MY FRANCHISE TO TOP
						return 1;
					} else if (apts < bpts) {
						return 1;
					} else if (apts > bpts) {
						return -1;
					} else {
						return 0;
					}
				});
			}
			html = "<tr><td>\n";
			if ($("#hide_projections_cb").is(':checked')) var _style = ' style="display:none"';
			else var _style = '';
			for (var gid = 0; gid < game_ord.length; gid++) {
				var i = game_ord[gid];
				var game = [];
				if (/,/.test(ls_games[i])) {
					game = ls_games[i].split(",");
				} else {
					game[0] = '';
					game[1] = ls_games[i];
				}
				var link = "switch_game('" + game[1] + "','" + game[0] + "');";
				var current_matchup_class = "";
				var matchup_class = "";
				if (ls_vert_og) {
					if (game[1] === ls_global_allplay) current_matchup_class = " current_matchup";
				} else {
					if (i === current_matchup) current_matchup_class = " current_matchup";
					for (var j = 0; j < 2; j++) {
						if (game[j] === 'BYE') matchup_class = ' ls_other_game_bye';
						if (game[j] === 'AVG') matchup_class = ' ls_other_game_avg';
					}
				}
				html = html + '<div id="og_' + i + '" class="ls_other_game' + matchup_class + current_matchup_class + '" onclick="' + link + '" onmouseenter="set_border(this,1);" onmouseleave="set_border(this,0);" style="display:inline-block;" title="View Match Up"><table border="0" cellspacing="0" cellpadding="0">\n';
				for (var j = 0; j < 2; j++) {
					if (game[j] == '') {} else if (game[j] == 'BYE') {
						html = html + '<tr><td class="ls_og_cell">BYE</td><td id="ls_pace_box_BYE" class="ls_pace_box_BYE ls_projections ls_pace_box"' + _style + '></td><td style="border:none;"><div></div></td><td style="border:none;"><div></div></td></tr>\n';
					} else if (game[j] == 'AVG') {
						ls_do_avg = 1;
						html = html + '<tr><td class="ls_og_cell">AVG</td><td id="ls_pace_box_AVG" class="ls_pace_box_BYE ls_projections ls_pace_box"' + _style + '></td><td align="right" style="border:none;"><div class="ogffpts_avg">0</div></td><td style="border:none;"><div></div></td></tr>\n';
					} else {
						var fidkey = "fid_" + game[j];
						html = html + '<tr><td class="ls_og_cell">' + ls_get_icon_abbrev(fidkey) + '</td>';

						html = html + '<td id="ls_pace_box_' + game[j] + '" class="ls_pace_box_' + game[j] + ' ls_projections ls_pace_box"' + _style + '>';
						if (ls_includeProjections) {
							if (ls_pace_tracker.hasOwnProperty(fidkey)) html = html + ls_pace_tracker[fidkey].S;
							else html = html;
						} else {
							html = html;
						}
						html = html + '</td>';

						html = html + '<td align="right" style="border:none;"><div class="ogffpts_' + game[j] + '">';
						html = html + format_points(ls_fran_totals[game[j]].total);
						html = html + '</div></td><td style="border:none;"><div class="oggstat_' + game[j] + '">';
						html = html + ls_fran_totals[game[j]].fin;
						html = html + '</div></td></tr>\n';
					}
				}
				html = html + "</table></div>\n";
			}
			html = html + '</td>';
			html = html + '</tr>\n';
			load_elem("other_games", html);
			if (ls_hide_bye_teams) {
				$("[id^=og_].ls_other_game_bye").each(function () {
					$(this).hide();
				});
			}
			// Break Rows - show matchups in single , 2 or 3 rows
			const ls_count_games = $('#other_games .ls_other_game:visible').length;
			const ls_count_half = ls_count_games / 2;
			const ls_count_half_round = Math.round(ls_count_half);
			const ls_count_third = ls_count_games / 3;
			const ls_count_third_round = Math.round(ls_count_third);
			const ls_count_third_round2 = (+ls_count_third_round) + (+ls_count_third_round);
			switch (BreakRows) {
				case 1:
					// Do Nothing
					break;
				case 2:
					$('#other_games div.ls_other_game:nth-child(' + ls_count_half_round + ')').after('<div class="ls_divide" style="display:block;height:0.313rem"></div>');
					break;
				case 3:
					$('#other_games div.ls_other_game:nth-child(' + ls_count_third_round + '),#other_games div.ls_other_game:nth-child(' + ls_count_third_round2 + ')').after('<div class="ls_divide" style="display:block;height:0.313rem"></div>');
					break;
			}

		} // end build_other_games


		////////////////////////////////////////////////////////////////////
		//                  FUNCTION - ls_get_icon_abbrev                 //
		////////////////////////////////////////////////////////////////////
		function ls_get_icon_abbrev(fidKey) {
			switch (ls_box_abbrev_name_icon) {
				case 0: //ABBREV
					return '<span class="ls_og_abbrev">' + franchiseDatabase[fidKey].abbrev + '</span>';
					break;
				case 1: //FULL NAME
					return '<span class="ls_og_full_name" style="display:inline-block;max-width:5rem;overflow:hidden">' + franchiseDatabase[fidKey].name + '</span>';
					break;
				case 2: //ICON ON FAIL USE LOGO ON FAIL USE ABBREV
					if (franchiseDatabase[fidKey].icon !== "")
						return '<img class="ls_og_icon" src="' + franchiseDatabase[fidKey].icon + '" alt="' + franchiseDatabase[fidKey].name + '" title="' + franchiseDatabase[fidKey].name + '" />';
					else if (franchiseDatabase[fidKey].logo !== "")
						return '<img class="ls_og_icon" src="' + franchiseDatabase[fidKey].logo + '" alt="' + franchiseDatabase[fidKey].name + '" title="' + franchiseDatabase[fidKey].name + '" />';
					else
						return '<span class="ls_og_abbrev">' + franchiseDatabase[fidKey].abbrev + '</span>';
					break;
				case 3: //ICON+ABBREV ON FAIL USE LOGO+ABBREV ON FAIL USE ABBREV
					if (franchiseDatabase[fidKey].icon !== "")
						return '<img class="ls_og_icon" src="' + franchiseDatabase[fidKey].icon + '" alt="' + franchiseDatabase[fidKey].name + '" title="' + franchiseDatabase[fidKey].name + '" /><span class="ls_og_icon_abbrev" style="vertical-align:middle;padding-left:0.25rem">' + franchiseDatabase[fidKey].abbrev + '</span>';
					else if (franchiseDatabase[fidKey].logo !== "")
						return '<img class="ls_og_icon" src="' + franchiseDatabase[fidKey].logo + '" alt="' + franchiseDatabase[fidKey].name + '" title="' + franchiseDatabase[fidKey].name + '" /><span class="ls_og_icon_abbrev" style="vertical-align:middle;padding-left:0.25rem">' + franchiseDatabase[fidKey].abbrev + '</span>';
					else
						return '<span class="ls_og_abbrev">' + franchiseDatabase[fidKey].abbrev + '</span>';
					break;
				case 4: //ICON+NAME ON FAIL USE LOGO+NAME ON FAIL USE NAME
					if (franchiseDatabase[fidKey].icon !== "")
						return '<img class="ls_og_icon" src="' + franchiseDatabase[fidKey].icon + '" alt="' + franchiseDatabase[fidKey].name + '" title="' + franchiseDatabase[fidKey].name + '" /><span class="ls_og_icon_full_name" style="display:inline-block;max-width:3.125rem;overflow:hidden;vertical-align:middle;padding-left:0.25rem">' + franchiseDatabase[fidKey].name + '</span>';
					else if (franchiseDatabase[fidKey].logo !== "")
						return '<img class="ls_og_icon" src="' + franchiseDatabase[fidKey].logo + '" alt="' + franchiseDatabase[fidKey].name + '" title="' + franchiseDatabase[fidKey].name + '" /><span class="ls_og_icon_full_name" style="display:inline-block;max-width:3.125rem;overflow:hidden;vertical-align:middle;padding-left:0.25rem">' + franchiseDatabase[fidKey].name + '</span>';
					else
						return '<span class="ls_og_full_name" style="display:inline-block;max-width:5rem;overflow:hidden">' + franchiseDatabase[fidKey].name + '</span>';
					break;
				default:
					return '<span class="ls_og_abbrev">' + franchiseDatabase[fidKey].abbrev + '</span>';
			}
			//console.log("ls_box_abbrev_name_icon"); // REMOVE AFTER TESTING - CONSOLE LOGGING
		} // end ls_box_abbrev_name_icon


		////////////////////////////////////////////////////////////////////
		//                    FUNCTION - build_one_team                   //
		////////////////////////////////////////////////////////////////////
		function build_one_team(which, fid) {
			var html = "";
			var proj_style = ($("#hide_projections_cb").is(':checked')) ? ' style="display:none"' : '';
			var proj_class = ($('input[name="hide_stats"]').is(':checked')) ? ' td-pad' : '';
			if (fid != 'BYE' && fid != 'AVG') {
				ls_showing[which] = fid;
				var fidkey = "fid_" + [fid];
				html = html + '<caption>' + ls_get_icon_abbrev(fidkey) + '</caption>';
				for (var i in ls_rkeys) {
					var rk = ls_rkeys[i];
					var last_pos = "";
					if ((typeof ls_rosters[fid][rk] != 'undefined') &&
						(ls_rosters[fid][rk].length > 0)) {
						var rowclass = "ls_" + (rk == 'S' ? 'starters' : 'nonstarters');
						html = html + '<tr class="' + rowclass + '"><th>' + ls_rkey_labels[rk] + '</th><th class="ls_game_info">Game</th>';
						if (ls_includeProjections) html = html + '<th class="ls_projections"' + proj_style + ' title="Pace/Projected Points">PP</th>';
						html = html + '<th>Points</th>';
						var rowcnt = 0;
						for (var j in ls_rosters[fid][rk]) {
							var rowstyle = (rowcnt % 2) ? "oddtablerow" : "eventablerow"
							rowstyle = rowstyle + " " + rowclass;
							var pid = ls_rosters[fid][rk][j];
							var nfl_team = ls_player[pid].nfl_team;
							if (/^FA/.test(nfl_team)) {
								pgame = "";
							} else {
								if (ls_def_pos[ls_player[pid].pos] &&
									ls_nfl_games[nfl_team].opp != "BYE") {
									nfl_team = ls_nfl_games[nfl_team].opp;
								}
								pgame = ls_nfl_games[nfl_team]["game_status"];
								if (pgame === undefined) pgame = "No Matchup";
							}
							if (j > 0 && ls_player[pid].pos != last_pos) {
								rowstyle = rowstyle + " newposition";
							}
							last_pos = ls_player[pid].pos;
							var ppts = format_points((ls_player[pid].points == undefined) ?
								0 : ls_player[pid].points);
							var pstats = ls_player[pid].stats_str == undefined ? "- stats -" : ls_player[pid].stats_str;
							var link = "player?L=" + league_id + "&P=" + pid;
							html = html + '<tr class="' + rowstyle + '"><td class="td-first-type"><a href="' + link + '" target="new" class="reallysmall" title="View Player News">' + ls_player[pid].name + '</a><br>' + ls_player[pid].nfl_team + ' ' + ls_player[pid].pos + '';
							try {
								if (ls_injuries["pid_" + pid] !== undefined) {
									html = html + ' (<span class="warning injurystatus" title="' + ls_injuries["pid_" + pid].status + '">' + ls_injuries["pid_" + pid].code + '</span>)';
								}
							} catch (error) {};
							html = html + '<div class="ls_player_stats" style="position: absolute;bottom:0.125rem;height:unset"><div class="stats_' + pid + ' reallysmall" style="font-size: 0.625rem;white-space: nowrap">' + pstats + '</div></div></td>';
							html = html + '<td class="ls_game_info"><div class="game_' + nfl_team + ' reallysmall">' + pgame + '</div></td>';
							if (ls_includeProjections) html = html + '<td class="ls_projections' + proj_class + '"' + proj_style + ' id="ls_pace_pts_' + pid + '"></td>';
							var exp_link = "ls_explain_points('" + pid + "');";
							html = html + '<td align="right"><div onclick="' + exp_link + '" class="pfpts_' + pid + ' reallysmall" style="text-decoration:underline;" title="Click to View Details">' + ppts + '</div></td></tr>';
							rowcnt++;
						}
						if (rk == 'S' && ls_hfa[fid] != undefined && ls_hfa[fid] != 0 &&
							which == 'home') {
							var rowstyle = (rowcnt % 2) ? "oddtablerow" : "eventablerow"
							rowstyle = rowstyle + " " + rowclass + " newposition";
							html = html + '<tr class="td-totals-row ' + rowstyle + '"><td class="reallysmall td-totals">Home Field Advantage</td>';
							html = html + '<td class="ls_game_info"><div class="reallysmall"></div></td>';
							if (ls_includeProjections) html = html + '<td class="ls_projections' + proj_class + '"' + proj_style + '></td>';
							html = html + '<td align="right"><div class="reallysmall">' + ls_hfa[fid] + '</div></td></tr>';
							rowcnt++;
						}
						if (rk == 'S' && ls_adjust[fid] != undefined) {
							var rowstyle = (rowcnt % 2) ? "oddtablerow" : "eventablerow"
							rowstyle = rowstyle + " " + rowclass + " newposition";
							html = html + '<tr class="td-totals-row ' + rowstyle + '"><td class="reallysmall" class="td-totals">' + ls_adjust[fid].label + '</td>';
							html = html + '<td class="ls_game_info"><div class="reallysmall"></div></td>';
							if (ls_includeProjections) html = html + '<td class="ls_projections' + proj_class + '"' + proj_style + '></td>';
							html = html + '<td align="right"><div class="reallysmall">' +
								format_points(ls_adjust[fid].value) +
								'</div></td></tr>';
							rowcnt++;
						}
						if (rk == 'S' || rk == 'NS') {
							var rowstyle = (rowcnt % 2) ? "odd" : "even"
							html = html + '<tr class="td-totals-row ' + rowstyle + 'tablerow ' + rowclass + '"><td align="left" class="td-totals"><b>Total Points</b></td><td class="ls_game_info"></td>';
							if (ls_includeProjections) html = html + '<td class="ls_projections ls_projections_' + rk + ' ffpts_pace_total' + proj_class + '"' + proj_style + ' id="ls_pace_' + fid + '"></td>';
							html = html + '<td class="ls_marquee_value" align="right"><div id="';
							if (rk == 'S') {
								html = html + 'fspts_';
							} else {
								html = html + 'frpts_';
							}
							var totpts = (rk == 'S') ? ls_fran_totals[fid].total :
								ls_fran_totals[fid].nstotal;
							html = html + fid + '">' + format_points(totpts) + '</div></td></tr>';
						}
					} else if (rk == 'S') {
						if (ls_includeProjections)
							html = html + '<tr><th colspan="5">This franchise did not set a lineup this week or the lineups are hidden.</th></tr>';
						else
							html = html + '<tr><th colspan="4">This franchise did not set a lineup this week or the lineups are hidden.</th></tr>';
					}
				}
			}
			load_elem("roster_" + which, html);
			try {
				MFLPlayerPopupNewsIcon();
			} catch (er) {}
			if (ls_should_hide_gs) {
				hide_by_class("ls_game_info", true, "table-cell");
			}
			if (ls_should_hide_ps) {
				hide_by_class("ls_player_stats", true, "table-cell");
			}
			if (ls_should_hide_rs) {
				hide_by_class("ls_nonstarters", true, "table-row");
			}
			if (ls_should_hide_ts) {
				hide_by_id("ls_ticker_tab_id", true, "inline");
			}
			if (ls_should_hide_wp) {
				hide_by_class("ls_proj_points", true, "table-cell");
				hide_by_id("ls_row_winprob_home", ls_should_hide_wp, "table-row");
				hide_by_id("ls_row_winprob_away", ls_should_hide_wp, "table-row");
			}
			if ($('input[name="hide_stats"]').is(':checked')) {
				$('#roster_away td, #roster_home td').addClass('td-pad');
			}
		} // end build_one_team

	} // end if $('script[src*="mfl_live_scoring.js"]').length

} // END MFL LIVE SCORING

// Add this outside of Live Scoring body id to target all links on page to add end week string UPDATED
$(document).ready(function () {
	setTimeout(function () {
		var urlParams = new URLSearchParams(window.location.search);
		var isTest = urlParams.get('TEST_WEEK');
		if (liveScoringWeek === 0 && isTest) {
			$.each(
				$('a[href*="ajax_ls?L"]'),
				function (index, value) {
					//$(value).attr('href', $(value).attr('href') + '&TEST_WEEK=1');
					$(value).addClass('scoringLinkDisable'); // added instead of making scoring link to TEST scoring page

				}
			);
		} else if (liveScoringWeek === 0) {
			$.each(
				$('a[href*="ajax_ls?L"]'),
				function (index, value) {
					//$(value).removeAttr('href'); // added instead of making scoring link to TEST scoring page
					//$(value).attr('onclick', 'scoringLinkDisable()'); // added instead of making scoring link to TEST scoring page
					$(value).addClass('scoringLinkDisable'); // added instead of making scoring link to TEST scoring page
				}
			);
		}
		if (completedWeek > endWeek || real_ls_week > endWeek) {
			$.each(
				$('a[href*="ajax_ls?L"]'),
				function (index, value) {
					//$(value).attr('href', $(value).attr('href') + '&W=' + real_ls_week + '&W2=' + endWeek);
				}
			);
		}
	}, 1000);
}); // end UPDATE URL LINKS ON SCORING PAGE WHEN IN PREVIOUS WEEKS

$(document).on('click', '.scoringLinkDisable', function (e) {
	e.preventDefault();
	alert("Live Scoring Will Start 24 Hours Prior To Kickoff Of First Game Of The Week. Live Scoring is disabled during offseason.");
});
</script>