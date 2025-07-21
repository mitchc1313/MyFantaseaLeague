const allowedPageIds = [
	'body_add_drop',
	'body_options_257',
	'body_csetup_cantadd',
	'body_csetup_cantcut',
	'body_options_178',
	'body_load_rosters',
	'body_options_256'
  ];

  if (allowedPageIds.includes(document.body.id)) {
	document.addEventListener("DOMContentLoaded", function () {

//////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL USE ITEMS
//////////////////////////////////////////////////////////////////////////////////////////////////

let curRoster = [];

const sortPlayerPosOrder = {
	COACH: 1,
	QB: 2,
	TMQB: 3,
	RB: 4,
	TMRB: 5,
	FB: 6,
	WR: 7,
	TMWR: 8,
	TE: 9,
	TMTE: 10,
	KR: 13,
	PK: 14,
	TMPK: 15,
	PN: 16,
	TMPN: 17,
	OFF: 18,
	DEF: 19,
	ST: 20,
	DT: 22,
	DE: 23,
	TMDL: 24,
	LB: 25,
	TMLB: 26,
	CB: 27,
	S: 29,
	TMDB: 30
};

function sortPlayerObjectData(player, key) {
	switch (key) {
		case "name":
			const name = typeof player.name === "string" ? player.name : "";
			const [last, first] = name.split(", ");
			return `${first || ""} ${last || ""}`.toLowerCase();
		case "pos":
			const rank = sortPlayerPosOrder?.[player.pos?.toUpperCase?.()] || 999;
			return rank;
		case "nfl_team":
			return player.nfl_team?.toUpperCase?.() || "";
		case "bye_week":
			return parseInt(player.bye_week, 10) || 0;
		case "fsrank":
			return parseFloat(player.fsrank) || 0;
		case "adp":
			return parseFloat(player.adp) || 0;
		case "myrank":
			return parseFloat(player.myrank) || 0;
		case "projpts":
			return parseFloat(player.projpts) || 0;
		case "player_salary":
			return parseFloat(player.sort_sal) || 0;
		case "pwpts":
			return parseFloat(player.pwpts) || 0;
		default:
			return "";
	}
}

function sortScrollFadeShadow(listId, headerSelector) {
	const scrollContainer = document.getElementById(listId);
	const header = document.querySelector(headerSelector);

	if (!scrollContainer || !header) return;

	header.style.position = "relative"; // make sure it's not static

	scrollContainer.addEventListener("scroll", () => {
		if (scrollContainer.scrollTop > 0) {
			header.classList.add("shadow-fade-bottom");
		} else {
			header.classList.remove("shadow-fade-bottom");
		}
	});
}

function sortSyncCurRosterOrder() {
	const dropList = document.getElementById("drop-player-list");
	if (!dropList) return;

	const rows = dropList.querySelectorAll(".add-drop-player-row");
	const newOrder = [];

	rows.forEach(row => {
		const playerId = row.dataset.playerId;
		const player = curRoster.find(p => p.id === playerId);
		if (player) newOrder.push(player);
	});

	curRoster = newOrder;
	renderPlayerList(curRoster, "drop-player-list", "drop");
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// adds and drops page
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "add_drop") {
	const style = document.createElement("style");
	style.textContent = `#add_drop table,#add_drop .mobile-wrap{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
		const franchiseForm = document.querySelector('form[name="SELECT_FRANCHISE"]');
		if (!franchiseForm) document.body.classList.add("addDropSubmit");
		document.querySelectorAll('#add_drop table.report').forEach(table => {
			// Check if already wrapped
			if (table.parentElement?.classList.contains('mobile-wrap')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'mobile-wrap';

			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		});
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("addDropSelect"); // add this class to use for CSS to target only the add - drop form page
		//document.querySelectorAll("body br").forEach(br => br.remove());

		let originalAddTable = null;
		let calendarRules = true;
		let originalWrapper = null;

		document.querySelectorAll("table").forEach(table => {
			const captionSpan = table.querySelector("caption > span");
			if (captionSpan && captionSpan.textContent.includes("Add/Drop")) {
				originalAddTable = table;
				originalWrapper = table.closest(".mobile-wrap");
			}
		});

		if (typeof addDropShowRoster === "undefined") {
			var addDropShowRoster = true;
		}
		if (typeof addDropShowWaiver === "undefined") {
			var addDropShowWaiver = true;
		}
		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}
		if (typeof showWaiverCommentBox === "undefined") {
			var showWaiverCommentBox = true;
		}

		const addDropContainer = document.querySelector("#add_drop");
		if (addDropContainer) {
			// do not run if calendar rules say no add/drop at this time
			const warning = addDropContainer?.querySelector("p.warning");
			if (warning && warning.textContent.includes("According") && warning.textContent.includes("League Calendar") || warning && warning.textContent.includes("Franchise") && warning.textContent.includes("Do Not Have")) {
				calendarRules = false;
				const tables = addDropContainer.querySelectorAll("table.report");
				let rosterTableHTML = "";
				let waiverTableHTML = "";

				tables.forEach(table => {
					const captionText = table.querySelector("caption > span")?.textContent?.trim();
					if (captionText === "Roster Limits") {
						rosterTableHTML = table.outerHTML;
						table.remove(); // optional: remove original table from DOM
					}
					if (captionText === "Current Waiver Order") {
						const tbody = table.querySelector("tbody") || table.createTBody();
						const newRow = document.createElement("tr");
						newRow.className = "oddtablerow";
						newRow.innerHTML = `<th class="rank" style="text-align:center">#</th><th style="text-align:left">Franchise</th>`;
						tbody.insertBefore(newRow, tbody.firstChild);
						waiverTableHTML = table.outerHTML;
						table.remove(); // optional: remove original table from DOM
					}
				});
				let html = ``
				html += `<div id="enhanced-add-drop-ui">`;
				html += `<div id="add-drop-not-permission" class="mobile-wrap"><div class="summary-title warning" style="margin:0 auto;text-align:center;">Calendar Rules Prevent You From Making Add-Drops At This Time</div></div>`;
				html += `</div>`;

				if (rosterTableHTML && addDropShowRoster || waiverTableHTML && addDropShowWaiver) {
					html += `<div id="add-drop-enhanced-ui-tables">`;
					// Append Original Roster and Waivers Tables if one / other / both exists
					if (rosterTableHTML && addDropShowRoster) {
						html += `<div class="roster-container mobile-wrap">${rosterTableHTML}</div>`;
					}
					if (waiverTableHTML && addDropShowWaiver) {
						html += `<div class="waiver-container mobile-wrap">${waiverTableHTML}</div>`;
					}
					html += `</div>`
				}

				if (originalWrapper) {
					originalWrapper.insertAdjacentHTML("beforebegin", html);
					originalWrapper.remove();
				} else if (originalAddTable) {
					originalAddTable.insertAdjacentHTML("beforebegin", html);
					originalAddTable.remove();
				} else {
					addDropContainer.insertAdjacentHTML("beforeend", html);
				}
				requestAnimationFrame(() => {
					document.body.appendChild(style);
				});
				console.warn("ðŸš« Add/Drop disabled by League Calendar.");
			} else {
				const addPlayers = window.playerDatabaseObj?.add || [];
				const dropPlayers = window.playerDatabaseObj?.drop || [];
				const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
				const dropHasSalary = Object.values(dropPlayers).some(p => p.sal !== undefined);
				const addPidInput = document.getElementById("add_pid_field_id");
				const addPidValue = addPidInput?.value?.trim() || null;

				let franchiseId = document.querySelector('input[name="FRANCHISE"]')?.value || "";
				if (!franchiseId) {
					franchiseId = franchise_id;
				}
				const franchiseKey = `fid_${franchiseId}`;
				const franchiseObj = franchiseDatabase[franchiseKey];
				const franchiseName = franchiseObj?.name || "Unknown Franchise";

				let selectedAdd = null;
				let selectedDrop = null;
				let currentSortKeyAdd = null;
				let currentSortKeyDrop = null;
				let sortDirectionAdd = 1;
				let sortDirectionDrop = 1;

				// Step 1: Extract and deduplicate hidden inputs
				const hiddenInputs = Array.from(addDropContainer.querySelectorAll('input[type="hidden"]'));
				const seenNames = new Set();
				const uniqueInputs = [];

				hiddenInputs.forEach(input => {
					const name = input.getAttribute("name");
					if (name && !seenNames.has(name)) {
						seenNames.add(name);
						uniqueInputs.push(input);
					}
				});

				const sourceSelect = document.getElementById("add_filt_pos");
				let optionsHTML = null;
				if (sourceSelect) {
					optionsHTML = Array.from(sourceSelect.options)
						.filter(opt => opt.value.toUpperCase() !== "ALL")
						.map(opt => {
							const upperVal = opt.value.toUpperCase();
							return `<option value="${upperVal}">${upperVal}</option>`;
						}).join("");
				}

				const nflFilterSelect = document.getElementById("add_filt_nfl");

				if (nflFilterSelect) {
					nflFilterSelect.removeAttribute("onchange");
				}

				const tables = addDropContainer.querySelectorAll("table.report");
				let rosterTableHTML = "";
				let waiverTableHTML = "";

				tables.forEach(table => {
					const captionText = table.querySelector("caption > span")?.textContent?.trim();
					if (captionText === "Roster Limits") {
						rosterTableHTML = table.outerHTML;
						table.remove(); // optional: remove original table from DOM
					}
					if (captionText === "Current Waiver Order") {
						const tbody = table.querySelector("tbody") || table.createTBody();
						const newRow = document.createElement("tr");
						newRow.className = "oddtablerow";
						newRow.innerHTML = `<th class="rank" style="text-align:center">#</th><th style="text-align:left">Franchise</th>`;
						tbody.insertBefore(newRow, tbody.firstChild);
						waiverTableHTML = table.outerHTML;
						table.remove(); // optional: remove original table from DOM
					}
				});

				const addFieldName = document.getElementById("add_name_field_id");
				const dropFieldName = document.getElementById("drop_name_field_id");
				const addBtn = document.getElementById("add_drop_submit");

				const RoundsRow = document.getElementById("round_field_id");
				let RoundsRowInputHTML = "";
				if (RoundsRow) {
					const RoundsSelect = RoundsRow.querySelector('select');
					if (RoundsSelect) {
						RoundsRowInputHTML = RoundsSelect.outerHTML;
					}
					RoundsRow.remove(); // remove the entire row from the DOM
				}

				const waiverRow = document.getElementById("force_waiver_claim_p");
				let forceWaiverInputHTML = "";
				let forceWaiverlabelHTML = "";
				if (waiverRow) {
					const waiverInput = waiverRow.querySelector('input[type="checkbox"][name="FORCE_WAIVER"]');
					if (waiverInput) {
						forceWaiverInputHTML = waiverInput.outerHTML;
					}
					const waiverlabel = waiverRow.querySelector('label[for="FORCE_WAIVER"]');
					if (waiverlabel) {
						forceWaiverlabelHTML = waiverlabel.outerHTML;
					}
					waiverRow.remove(); // remove the entire row from the DOM
				}

				const BBIDSelect = document.getElementById("amt_field_id");
				let BBIDSelectInputHTML = "";
				let BBIDMaxBidText = "";
				if (BBIDSelect) {
					const tds = BBIDSelect.querySelectorAll("td");
					const BBIDinput = tds[1]?.querySelector("input");
					if (BBIDinput) {
						BBIDSelectInputHTML = BBIDinput.outerHTML;

						// Get the full text content of the <td>, then remove the input's outerHTML from it
						let fullText = tds[1].innerHTML;
						let inputHTML = BBIDinput.outerHTML;
						BBIDMaxBidText = fullText.replace(inputHTML, "").trim();
					}
					BBIDSelect.remove(); // Remove the row from the DOM
				}

				const commentsBox = document.getElementById("comments_field_id");
				let leftCellHTML = "";
				let rightCellHTML = "";

				if (commentsBox) {
					const tds = commentsBox.querySelectorAll("td");
					if (tds.length >= 2) {
						leftCellHTML = tds[0].innerHTML.trim();

						const tagName = 'text' + 'area';
						const inputBox = tds[1].querySelector(tagName + '[name="COMMENTS"]');
						if (inputBox) {
							inputBox.setAttribute("rows", "1");
							inputBox.removeAttribute("cols");
						}

						rightCellHTML = tds[1].innerHTML.trim();
					}
					commentsBox.remove(); // Remove the entire row from the DOM
				}

				let html = ``
				html += `<form id="AddDropForm" action="add_drop" method="POST">`;

				uniqueInputs.forEach(input => {
					html += input.outerHTML;
				});

				html += `<div id="enhanced-add-drop-ui">`;

				if (addFieldName && addBtn && dropFieldName) {
					html += `<div id="add-drop-summary" class="mobile-wrap">`;
					html += `<table align="center" class="report selected-moves">`;
					html += `<caption><span>Selected Moves</span></caption>`;
					html += `<tbody>`;
					html += `<tr><th colspan="100">Enter Players Before Submitting Requests</th></tr>`;
					html += `<tr><td>`;


					// add content if found for add - drop - submit button - comments - bbid - rounds
					html += `<div class="wrapper-add-first">`;
					html += `<div class="row-add-drop-btn">`;
					html += `<div class="box-add-drop-btn adds-names shrink"><div class="adds-names" style="display:inline-block"><strong>Add:</strong></div><span id="add_name_field_id" style="padding-left:0.313rem">Select Player To Add</span></div>`;
					html += `<div class="box-add-drop-btn shrink"><div class="adds-names" style="display:inline-block"><strong>Drop:</strong></div><span id="drop_name_field_id" style="padding-left:0.313rem">Select Player To Drop</span></div>`;
					html += `<div class="box-add-drop-btn grow addBtn desktop-add-btn" style="text-align:right"></div>`;
					html += `</div>`;
					html += `</div>`;

					// row checkbox - rounds and bbid
					if (forceWaiverInputHTML && forceWaiverlabelHTML) {
						html += `<div class="wrapper-add-second">`;
						html += `<div class="row-add-drop-btn">`;
						if (RoundsRowInputHTML) {
							html += `<div class="box-add-drop-btn has-rounds-row shrink"><div id="force_waiver_claim_p" class="hidden"><span class="fa-checkbox" id="customCheckbox"><i class="fa-regular fa-square"></i></span><label for="FORCE_WAIVER">Submit as waiver claim</label>${forceWaiverInputHTML}<div style="display:none" align="left" id="add_note_field_id"></div></div></div>`;
						} else {
							html += `<div class="box-add-drop-btn shrink"><div id="force_waiver_claim_p" class="hidden"><span class="fa-checkbox" id="customCheckbox"><i class="fa-regular fa-square"></i></span><label for="FORCE_WAIVER">Submit as waiver claim</label>${forceWaiverInputHTML}<div style="display:none" align="left" id="add_note_field_id"></div></div></div>`;
						}
						if (RoundsRowInputHTML) {
							html += `<div class="box-add-drop-btn grow rounds-row"><div id="round_field_id" class="hidden"><div id="addgroupTXT" style="display:inline-block">Add to group:</div>${RoundsRowInputHTML}</div></div>`;
						}
						if (BBIDSelectInputHTML && BBIDMaxBidText) {
							if (RoundsRowInputHTML) {
								html += `<div class="box-add-drop-btn has-rounds-add"><div id="amt_field_id" class="hidden">BBID Amt:${BBIDSelectInputHTML} ${BBIDMaxBidText}</div></div>`;
							} else {
								html += `<div class="box-add-drop-btn no-rounds-add grow"><div id="amt_field_id" class="hidden">BBID Amt:${BBIDSelectInputHTML} ${BBIDMaxBidText}</div></div>`;
							}
						}
						html += `</div>`;
						html += `</div>`;
					}

					if (leftCellHTML && rightCellHTML) {
						// row for comments box
						if (showWaiverCommentBox) {
							html += `<div id="comments_field_id" class="wrapper-add-first hidden">`;
						} else {
							html += `<div id="comments_field_id" style="display:none!important" class="wrapper-add-first hidden">`;
						}
						html += `<div class="row-add-drop-btn comments-row">`;
						html += `<div class="box-add-drop-btn">${leftCellHTML}</div><div class="box-add-drop-btn grow">${rightCellHTML}</div>`;
						html += `</div>`;
						html += `</div>`;
					}

					// add submit button on mobiles
					html += `<div id="add-button-mobile" class="wrapper-add-first">`;
					html += `<div class="row-add-drop-btn">`;
					html += `<div class="box-add-drop-btn grow addBtn mobile-add-btn" style="text-align:center"></div>`;
					html += `</div>`;
					html += `</div>`;


					html += `</td></tr></tbody></table></div>`; // close add-drop-summary and selected-moves table
				}

				html += `<div id="add-drop-enhanced-ui">`;

				if (optionsHTML || nflFilterSelect) {
					html += `<div class="filter-controls mobile-wrap">`;
					html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
					if (nflFilterSelect) html += nflFilterSelect.outerHTML;
					if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
					html += `</div>`;
				}

				html += `<div class="add-player-container mobile-wrap">`;

				html += `<table align="center" class="report cus-add-tableCap"><caption><span>Available Players</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="pwpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
				if (addHasSalary) {
					html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
				}
				html += `</div></th></tr></tbody></table>`;

				html += `<div id="add-player-list">`;
				// Add List Players are appended here
				html += `</div>`;
				html += `<div id="locked-msg" align="left" style="text-align:left"><b style="display:inline-block;text-align:center;width:1.5rem;">[L]</b> Locked: Cant Cut List <a href="options?L=${league_id}&amp;O=199" target="blank">Can't Cut List</a><br><b style="display:inline-block;text-align:center;width:1.5rem;">#</b> Locked: Global Lock<b style="display:inline-block;text-align:center;width:1.5rem;">*</b> Locked: Recently Dropped</div>`;
				html += `</div>`;

				html += `<div class="drop-player-container mobile-wrap">`;

				html += `<table align="center" class="report cus-drop-tableCap"><caption><span>${franchiseName} Roster</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="pwpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
				if (dropHasSalary) {
					html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
				}
				html += `</div></th></tr></tbody></table>`;

				html += `<div id="drop-player-list"></div>`;
				// Drop List Players are appended here
				html += `</div>`;
				html += `</div>`;

				html += `</div>`;

				html += `</div>`;

				html += `</form>`;

				if (rosterTableHTML && addDropShowRoster || waiverTableHTML && addDropShowWaiver) {
					html += `<div id="add-drop-enhanced-ui-tables">`;
					// Append Original Roster and Waivers Tables if one / other / both exists
					if (rosterTableHTML && addDropShowRoster) {
						html += `<div class="roster-container mobile-wrap">${rosterTableHTML}</div>`;
					}
					if (waiverTableHTML && addDropShowWaiver) {
						html += `<div class="waiver-container mobile-wrap">${waiverTableHTML}</div>`;
					}
					html += `</div>`
				}

				if (originalWrapper) {
					originalWrapper.insertAdjacentHTML("beforebegin", html);
					originalWrapper.remove();
				} else if (originalAddTable) {
					originalAddTable.insertAdjacentHTML("beforebegin", html);
					originalAddTable.remove();
				} else {
					addDropContainer.insertAdjacentHTML("beforeend", html);
				}

				if (addFieldName) addFieldName.remove();
				if (dropFieldName) dropFieldName.remove();
				if (addBtn) addBtn.remove();

				const removeHiddenInput = document.getElementById("AddDropForm");
				const allHiddenInputs = Array.from(addDropContainer.querySelectorAll('input[type="hidden"]'));
				allHiddenInputs.forEach(input => {
					if (!AddDropForm.contains(input)) {
						input.remove();
					}
				});

				const searchInput = document.getElementById("addDropSearch");
				const positionFilter = document.getElementById("position-filter");

				// Step 8: Remove all other forms with action="add_drop" except the new one
				const oldForms = document.querySelectorAll('form[action="add_drop"]');
				oldForms.forEach(form => {
					if (form.id !== "AddDropForm") {
						form.remove();
					}
				});


				// ADD FUNCTIONS

				function renderPlayerList(players, containerId, type) {
					const container = document.getElementById(containerId);
					if (!container) {
						console.warn(`â— Container ${containerId} not found.`);
						return;
					}
					container.textContent = ""; // Faster DOM clear

					let filtered = players;

					const addField = document.getElementById("add_pid_field_id") || {
						value: ""
					};
					const dropField = document.getElementById("drop_pid_field_id") || {
						value: ""
					};

					const addFieldName = document.getElementById("add_name_field_id");
					const dropFieldName = document.getElementById("drop_name_field_id");

					// Filter for "add"
					if (type === "add") {

						if (optionsHTML || nflFilterSelect) {
							const searchInput = document.getElementById("addDropSearch");
							const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

							const selectedPos = document.getElementById("position-filter")?.value || "";
							const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

							filtered = players.filter(p => {
								let [last, first] = p.name.split(", ");
								let fullName = `${first || ""} ${last || ""}`.trim();

								return (
									fullName.toLowerCase().includes(searchTerm) &&
									(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
									(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
								);
							});
						}

						// Sort after filtering, if a sort key is set
						if (currentSortKeyAdd) {
							addField.value = "";
							if (addFieldName) addFieldName.innerHTML = "Select Player To Add";
							filtered.sort((a, b) => {
								let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
								let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

								if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
									// If value is 0, push to bottom
									if (aVal === 0 && bVal !== 0) return 1;
									if (bVal === 0 && aVal !== 0) return -1;
									if (aVal === 0 && bVal === 0) return 0;
								}

								return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
							});
						}
					}

					if (type === "drop") {
						filtered.sort((a, b) => {
							const aPos = a.pos?.toUpperCase?.() || "";
							const bPos = b.pos?.toUpperCase?.() || "";
							const aRank = sortPlayerPosOrder[aPos] || 99;
							const bRank = sortPlayerPosOrder[bPos] || 99;

							if (aRank !== bRank) return aRank - bRank;

							const [alast, afirst] = a.name.split(", ");
							const [blast, bfirst] = b.name.split(", ");
							const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
							const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
							return aname.localeCompare(bname);
						});

						if (currentSortKeyDrop) {
							dropField.value = "";
							if (dropFieldName) dropFieldName.innerHTML = "Select Player To Drop";
							filtered.sort((a, b) => {
								let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
								let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

								if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
									// If value is 0, push to bottom
									if (aVal === 0 && bVal !== 0) return 1;
									if (bVal === 0 && aVal !== 0) return -1;
									if (aVal === 0 && bVal === 0) return 0;
								}

								return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
							});
						}
					}

					// Use document fragment for efficiency
					const fragment = document.createDocumentFragment();

					filtered.forEach((p, index) => {
						const [lastRaw, firstRaw] = p.name.split(", ");
						let first = firstRaw?.trim() || "";
						let last = lastRaw?.trim() || "";

						const hasHash = first.includes("#") || last.includes("#");
						const hasAsterisk = first.includes("*") || last.includes("*");
						const hasLock = first.includes("^") || last.includes("^");

						const isRookie = first.includes("(R)") || last.includes("(R)");

						first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
						last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
						const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

						let statusSpan = "";
						if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
						if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
						if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

						const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
						const imageUrl = isSpecial ?
							`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
							`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

						const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

						let infoLine = "";

						if (type === "drop") {
							if (p.sal) {
								infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
							} else {
								infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${p.roster ? ` &bull; Ros: ${p.roster}` : ''}</small>`;
							}
						} else {
							if (p.sal) {
								infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
							} else {
								infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}</small>`;
							}
						}

						const row = document.createElement("div");
						if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
						else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
						row.dataset.playerId = p.id;

						if (hasLock) {
							row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.pwpts)) ? parseFloat(p.pwpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
						} else {
							row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.pwpts)) ? parseFloat(p.pwpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
						}

						fragment.appendChild(row);
					});

					container.appendChild(fragment);
				}

				if (calendarRules) { // do not run if calendar rules say no add/drop at this time

					// AFTER addDropContainer.appendChild(newForm);
					const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

					if (enhancedUIContainer) {
						enhancedUIContainer.addEventListener("click", function (e) {
							const row = e.target.closest(".add-drop-player-row");
							if (!row || !enhancedUIContainer.contains(row)) return;

							const isAdd = !!row.closest("#add-player-list");
							const type = isAdd ? "add" : "drop";

							handlePlayerRowClick(row, type);
						});
					} else {
						console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
					}

					// Default to sorting Add list by WPROJ descending
					currentSortKeyAdd = "pwpts";
					sortDirectionAdd = -1;
					currentSortKeyDrop = "pos";
					sortDirectionDrop = 1;
					renderPlayerList(addPlayers, "add-player-list", "add");
					renderPlayerList(dropPlayers, "drop-player-list", "drop");

					const sortBarAdd = document.querySelector('.sort-bar.add-list');
					const sortBarDrop = document.querySelector('.sort-bar.drop-list');

					// Update caret icon and activate class on WPROJ button
					const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="pwpts"]');
					if (pwptsBtnAdd) {
						const icon = pwptsBtnAdd.querySelector("i");
						icon.classList.add("fa-caret-down");
						pwptsBtnAdd.classList.add("activated");
					}

					// Update caret icon and activate class on WPROJ button
					const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
					if (pwptsBtnDrop) {
						const icon = pwptsBtnDrop.querySelector("i");
						icon.classList.add("fa-caret-down");
						pwptsBtnDrop.classList.add("activated");
					}

					if (searchInput) {
						// Live filters (only for Add list)
						searchInput.addEventListener("input", () => {
							renderPlayerList(addPlayers, "add-player-list", "add");
							const addPlayerList = document.querySelector('#add-player-list');
							if (addPlayerList) {
								addPlayerList.scrollTo({
									top: 0
								});
							}
						});
					}

					if (positionFilter) {
						positionFilter.addEventListener("change", () => {
							renderPlayerList(addPlayers, "add-player-list", "add");
							const addPlayerList = document.querySelector('#add-player-list');
							if (addPlayerList) {
								addPlayerList.scrollTo({
									top: 0
								});
							}
						});
					}

					const updatedNFLFilter = document.getElementById("add_filt_nfl");
					if (updatedNFLFilter) {
						updatedNFLFilter.addEventListener("change", () => {
							renderPlayerList(addPlayers, "add-player-list", "add");
							const addPlayerList = document.querySelector('#add-player-list');
							if (addPlayerList) {
								addPlayerList.scrollTo({
									top: 0
								});
							}
						});
					}

					if (addPidValue) {
						const matchingRow = document.querySelector(`.add-drop-player-row[data-player-id="${addPidValue}"]`);
						if (matchingRow) {
							matchingRow.click();
						}
					}

					sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
					sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							setTimeout(() => {
								document.body.appendChild(style);
							}, timeFrame);
						});
					});

					// Sort listeners (only for Add list)
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
						button.addEventListener("click", () => {
							const key = button.dataset.key;

							// Update direction
							if (currentSortKeyAdd === key) {
								sortDirectionAdd *= -1;
							} else {
								currentSortKeyAdd = key;
								sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
							}

							// Remove existing icons and active class
							sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
								btn.classList.remove("activated");
								const icon = btn.querySelector("i");
								icon.className = "fa-solid"; // reset
							});

							// Set the active button + caret
							button.classList.add("activated");
							const icon = button.querySelector("i");
							icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

							renderPlayerList(addPlayers, "add-player-list", "add");

							const addPlayerList = document.querySelector('#add-player-list');
							if (addPlayerList) {
								addPlayerList.scrollTo({
									top: 0
								});
							}
						});
					});
					// Sort listeners (only for Drop list)
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
						button.addEventListener("click", () => {
							const key = button.dataset.key;

							// Update direction
							if (currentSortKeyDrop === key) {
								sortDirectionDrop *= -1;
							} else {
								currentSortKeyDrop = key;
								sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
							}

							// Remove existing icons and active class
							sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
								btn.classList.remove("activated");
								const icon = btn.querySelector("i");
								icon.className = "fa-solid"; // reset
							});

							// Set the active button + caret
							button.classList.add("activated");
							const icon = button.querySelector("i");
							icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

							renderPlayerList(dropPlayers, "drop-player-list", "drop");
							const dropPlayerList = document.querySelector('#drop-player-list');
							if (dropPlayerList) {
								dropPlayerList.scrollTo({
									top: 0
								});
							}
						});
					});
				}

				function handlePlayerRowClick(row, type) {
					const playerId = row.dataset.playerId;
					const button = row.querySelector("button");
					const isAdd = type === "add";

					const addField = document.getElementById("add_pid_field_id");
					const dropField = document.getElementById("drop_pid_field_id");

					const selected = isAdd ? selectedAdd : selectedDrop;
					const setSelected = isAdd ? (val) => (selectedAdd = val) : (val) => (selectedDrop = val);
					const field = isAdd ? addField : dropField;
					const summaryEl = document.getElementById(isAdd ? "add_name_field_id" : "drop_name_field_id");

					if (selected === row) {
						row.classList.remove("selected-player");
						setSelected(null);
						field.value = "";
						button.textContent = isAdd ? "Add" : "Drop";
						button.classList.remove("deselect-btn");
						button.classList.add("select-btn");
						summaryEl.textContent = isAdd ? "Select Player To Add" : "Select Player To Drop";
					} else {
						if (selected) {
							selected.classList.remove("selected-player");
							const prevBtn = selected.querySelector("button");
							if (prevBtn) {
								prevBtn.textContent = isAdd ? "Add" : "Drop";
								prevBtn.classList.remove("deselect-btn");
								prevBtn.classList.add("select-btn");
							}
						}
						row.classList.add("selected-player");
						setSelected(row);
						field.value = playerId;
						button.textContent = "Deselect";
						button.classList.remove("select-btn");
						button.classList.add("deselect-btn");

						const strongEl = row.querySelector(".player-info strong");
						let nameText = "";

						if (strongEl) {
							const cloned = strongEl.cloneNode(true); // avoid mutating original DOM
							const statusSpan = cloned.querySelector(".player-status");
							if (statusSpan) statusSpan.remove(); // remove span

							nameText = cloned.textContent.replace(/\(R\)/g, "").trim(); // remove (R) and trim
						}
						const pos = row.querySelector(".player-pos")?.textContent || "";
						const team = row.querySelector(".player-info small")?.textContent?.split("&bull;")[0]?.trim() || "";
						summaryEl.textContent = `${pos} ${nameText} (${team})`;
					}
					// ðŸ”½ ADD THIS AT THE VERY END
					const WaiverInputRow = document.getElementById("force_waiver_claim_p");
					if (WaiverInputRow) {
						const addHasValue = !!addField?.value;
						const dropHasValue = !!dropField?.value;

						if (!addHasValue && !dropHasValue) {
							WaiverInputRow.classList.add("hidden");

							const forceWaiverCheckbox = document.getElementById("FORCE_WAIVER");
							if (forceWaiverCheckbox && forceWaiverCheckbox.checked) {
								forceWaiverCheckbox.click(); // this will uncheck and trigger onchange
							}
						} else {
							WaiverInputRow.classList.remove("hidden");
						}
					}

					const submitBtn = document.getElementById("add_drop_submit");
					if (submitBtn) {
						const addHasValue = !!addField?.value;
						const dropHasValue = !!dropField?.value;

						if (!addHasValue && !dropHasValue) {
							submitBtn.disabled = true;
						} else {
							submitBtn.disabled = false;
						}
					}

				}

				function handleSubmitButtonChange() {
					const width = window.innerWidth;

					const addField = document.getElementById("add_pid_field_id");
					const dropField = document.getElementById("drop_pid_field_id");
					const waiverCheckbox = document.getElementById("FORCE_WAIVER");

					const addHasValue = !!addField?.value?.trim();
					const dropHasValue = !!dropField?.value?.trim();
					const shouldDisable = !(addHasValue || dropHasValue); // true if neither field has a value

					const isWaiverChecked = waiverCheckbox?.checked;
					const submitText = isWaiverChecked ? "Submit Request" : "Perform Add/Drop";

					const attachSubmitHandler = (button) => {
						button.addEventListener("click", function (e) {
							const bbidInput = document.querySelector('input[name="BBID_AMT"]');

							if (waiverCheckbox && waiverCheckbox.checked && bbidInput) {
								if (bbidInput.value.trim() === "") {
									e.preventDefault();
									alert("ðŸš« Please enter a BBID Amount for your waiver claim.");
								}
							}
						});
					};

					if (width < 700) {
						// Remove desktop version
						const desktopBtn = document.querySelector(".desktop-add-btn #add_drop_submit");
						if (desktopBtn) {
							desktopBtn.remove();
						}

						// Add to mobile container
						const mobileBtnContainer = document.querySelector(".mobile-add-btn");
						if (mobileBtnContainer && !mobileBtnContainer.querySelector("#add_drop_submit")) {
							const newBtn = document.createElement("input");
							newBtn.type = "submit";
							newBtn.id = "add_drop_submit";
							newBtn.name = "SUBMIT";
							newBtn.disabled = shouldDisable;
							newBtn.value = submitText;
							attachSubmitHandler(newBtn); // attach validation handler
							mobileBtnContainer.appendChild(newBtn);
						}

					} else {
						// Remove mobile version
						const mobileBtn = document.querySelector(".mobile-add-btn #add_drop_submit");
						if (mobileBtn) {
							mobileBtn.remove();
						}

						// Add to desktop container
						const desktopBtnContainer = document.querySelector(".desktop-add-btn");
						if (desktopBtnContainer && !desktopBtnContainer.querySelector("#add_drop_submit")) {
							const newBtn = document.createElement("input");
							newBtn.type = "submit";
							newBtn.id = "add_drop_submit";
							newBtn.name = "SUBMIT";
							newBtn.disabled = shouldDisable;
							newBtn.value = submitText;
							attachSubmitHandler(newBtn); // attach validation handler
							desktopBtnContainer.appendChild(newBtn);
						}
					}
				}


				handleSubmitButtonChange();
				window.addEventListener("resize", handleSubmitButtonChange);

				document.addEventListener("DOMContentLoaded", () => {
					const checkbox = document.getElementById("FORCE_WAIVER");
					const iconWrapper = document.getElementById("customCheckbox");
					const icon = iconWrapper?.querySelector("i");

					// Exit early if required elements are missing
					if (!checkbox || !iconWrapper || !icon) {
						return;
					}

					function updateCheckboxVisual() {
						if (checkbox.checked) {
							iconWrapper.classList.add("checked");
							icon.classList.remove("fa-square");
							icon.classList.add("fa-check-square");
						} else {
							iconWrapper.classList.remove("checked");
							icon.classList.remove("fa-check-square");
							icon.classList.add("fa-square");
						}
					}

					// Toggle checkbox when icon is clicked
					iconWrapper.addEventListener("click", () => {
						checkbox.checked = !checkbox.checked;
						checkbox.dispatchEvent(new Event("change"));
					});

					// Update icon when checkbox state changes
					checkbox.addEventListener("change", updateCheckboxVisual);

					// Initialize icon state
					updateCheckboxVisual();
				});


				const waiverRequestTable = addDropContainer.querySelector("#waiver_request_list");

				if (waiverRequestTable) {

					const wrapper = document.createElement("div");
					wrapper.className = "mobile-wrap requests-table";
					waiverRequestTable.parentNode.insertBefore(wrapper, waiverRequestTable);
					wrapper.appendChild(waiverRequestTable);

					// Replace action links with icons
					const keywordMap = {
						"COPY_ROUND=": {
							icon: "fa-regular fa-copy",
							title: "Copy Group To Next Round"
						},
						"MOVE_DOWN=": {
							icon: "fa-regular fa-angle-down",
							title: "Move Player Down"
						},
						"MOVE_UP=": {
							icon: "fa-regular fa-angle-up",
							title: "Move Player Up"
						},
						"DELETE=": {
							icon: "fa-regular fa-trash-xmark",
							title: "Delete This Player Request"
						},
						"ROUND=": {
							icon: "fa-regular fa-pencil",
							title: "Edit Waivers Selections"
						}
					};

					waiverRequestTable.querySelectorAll("td").forEach(td => {
						const matches = Array.from(td.querySelectorAll("a"))
							.map(link => {
								const href = link.getAttribute("href") || "";
								const keyword = Object.keys(keywordMap).find(k => href.includes(k));
								return keyword ? {
									link,
									keyword
								} : null;
							})
							.filter(Boolean);

						if (!matches.length) return;

						td.classList.add("action");
						td.textContent = "";

						matches.forEach(({
							link,
							keyword
						}, i) => {
							const {
								icon,
								title
							} = keywordMap[keyword];
							const newLink = document.createElement("a");
							newLink.href = link.href;
							newLink.title = title;
							const iconElem = document.createElement("i");
							icon.split(" ").forEach(cls => iconElem.classList.add(cls));
							iconElem.setAttribute("aria-hidden", "true");
							newLink.appendChild(iconElem);
							td.appendChild(newLink);
							if (i < matches.length - 1) td.appendChild(document.createTextNode(" "));
						});
					});

					// Caption
					const captionSpan = waiverRequestTable.querySelector("caption span");
					if (captionSpan) captionSpan.textContent = "Current Waiver Claims";

					// TH classes
					waiverRequestTable.querySelectorAll("th").forEach(th => {
						const text = th.textContent.trim();
						if (/Group|Round/.test(text)) th.classList.add("round");
						if (text.includes("Add")) th.classList.add("add-player");
						if (text.includes("Drop")) th.classList.add("drop-player");
						if (text.includes("Bid Amount")) th.classList.add("bid-amount");
						if (text.includes("Action")) th.classList.add("action");
					});

					// TD classes
					waiverRequestTable.querySelectorAll("td[rowspan]").forEach(td => {
						td.parentElement.classList.add("hasrowspan", "filtertr");
					});

					["oddtablerow", "eventablerow"].forEach(className => {
						waiverRequestTable.querySelectorAll(`tr.${className}.hasrowspan`).forEach(tr => {
							let sibling = tr.nextElementSibling;
							while (sibling && !sibling.classList.contains(className === "oddtablerow" ? "eventablerow" : "oddtablerow")) {
								sibling.classList.add("sub-hasrowspan", "filtertr");
								sibling = sibling.nextElementSibling;
							}
						});
					});

					waiverRequestTable.querySelectorAll("tr.eventablerow:not(.filtertr), tr.oddtablerow:not(.filtertr)").forEach(tr => {
						tr.classList.add("norowspan");
					});

					waiverRequestTable.querySelectorAll("tr").forEach(tr => {
						const td = tr.querySelector("td:first-child");
						if (td && /^[1-8]$/.test(td.textContent.trim())) td.classList.add("round");
					});

					waiverRequestTable.querySelectorAll('td a[href*="player?"], td a[href*="launch_player_modal"]').forEach(link => {
						const td = link.closest("td");
						if (td) td.classList.add("add-player");
					});

					waiverRequestTable.querySelectorAll("td.add-player + td.add-player").forEach(td => {
						td.className = "drop-player";
					});

					waiverRequestTable.querySelectorAll("td.points").forEach(td => td.classList.add("bid-amount"));
					waiverRequestTable.querySelectorAll("td").forEach(td => {
						if (td.textContent.includes("Delete")) td.classList.add("action");
					});

					// Remove time/comment TH columns
					let timeEnteredCol = Array.from(waiverRequestTable.querySelectorAll("tr th")).findIndex(th => th.textContent.trim() === "Time Entered");
					if (timeEnteredCol !== -1) {
						waiverRequestTable.querySelectorAll("tr").forEach(tr => {
							const ths = tr.querySelectorAll("th");
							if (ths[timeEnteredCol + 1]) ths[timeEnteredCol + 1].remove();
							if (ths[timeEnteredCol]) ths[timeEnteredCol].remove();
						});
					}

					// Expand rows with Time and Comment info
					waiverRequestTable.querySelectorAll("tr").forEach((tr, i, allRows) => {
						const tds = tr.querySelectorAll("td");
						if (tds.length <= timeEnteredCol) return;

						const rowspan = tds[0]?.getAttribute("rowspan");
						const timestamp = tds[timeEnteredCol]?.textContent.trim();
						const comments = tds[timeEnteredCol + 1]?.textContent.trim();
						const rowClass = tr.classList.contains("eventablerow") ? "eventablerow" : "oddtablerow";

						[tds[timeEnteredCol], tds[timeEnteredCol + 1]].forEach(td => td?.remove());

						const timeRow = document.createElement("tr");
						timeRow.className = rowClass;
						timeRow.innerHTML = `<td colspan="${timeEnteredCol}" class="time-cell"><span class="warning">Time Entered: </span>${timestamp}</td>`;

						const commentRow = document.createElement("tr");
						commentRow.className = rowClass;
						commentRow.innerHTML = `<td colspan="${timeEnteredCol}" class="comments-cell"><span class="warning">Comments: </span><span class="comment-span">${comments}</span></td>`;

						if (!rowspan) {
							tds[0]?.setAttribute("rowspan", "3");
							tr.after(commentRow);
							tr.after(timeRow);
						} else {
							const target = allRows[i + parseInt(rowspan) - 1];
							tds[0]?.setAttribute("rowspan", (parseInt(rowspan) + 2).toString());
							target?.after(commentRow);
							target?.after(timeRow);
						}
					});
				}
			}
		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end adds and drops page
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// drops page
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "options_257") {

	const style = document.createElement("style");
	style.textContent = `#body_options_257 table,#body_options_257 .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		let originalAddTable = null;
		let calendarRules = true;
		let newDrop = [];

		const appendHTML = document.querySelector('form[action*="add_drop"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}


		const addDropContainer = document.querySelector("#options_257");
		if (addDropContainer) {

			// do not run if calendar rules say no add/drop at this time
			const warning = addDropContainer?.querySelector("p.warning");
			if (warning && warning.textContent.includes("According") && warning.textContent.includes("League Calendar") || warning && warning.textContent.includes("Franchise") && warning.textContent.includes("Do Not Have")) {
				calendarRules = false;

				let html = ``
				html += `<div id="enhanced-add-drop-ui">`;
				html += `<div id="add-drop-not-permission" class="mobile-wrap"><div class="summary-title warning" style="margin:0 auto;text-align:center;">Calendar Rules Prevent You From Making Drops At This Time</div></div>`;
				html += `</div>`;

				if (appendHTML) {
					appendHTML.outerHTML = html;
				}

				requestAnimationFrame(() => {
					document.body.appendChild(style);
				});
				console.warn("ðŸš« Add/Drop disabled by League Calendar.");
			} else {
				const addPlayers = window.playerDatabaseObj?.picker || [];
				const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
				const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

				let franchiseId = document.querySelector('input[name="FRANCHISE"]')?.value || "";
				if (!franchiseId) {
					franchiseId = franchise_id;
				}
				const franchiseKey = `fid_${franchiseId}`;
				const franchiseObj = franchiseDatabase[franchiseKey];
				const franchiseName = franchiseObj?.name || "Unknown Franchise";

				let selectedAdd = null;
				let selectedDrop = null;
				let currentSortKeyAdd = null;
				let currentSortKeyDrop = null;
				let sortDirectionAdd = 1;
				let sortDirectionDrop = 1;

				let html = ``
				html += `<form id="AddDropForm" action="add_drop" method="POST">`;

				html += `<div id="enhanced-add-drop-ui">`;

				html += `<div id="add-drop-enhanced-ui">`;

				html += `<div class="add-player-container mobile-wrap">`;

				html += `<table align="center" class="report cus-add-tableCap"><caption><span>${franchiseName} Roster</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
				if (addHasSalary) {
					html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
				}
				html += `</div></th></tr></tbody></table>`;

				html += `<div id="add-player-list">`;
				// Add List Players are appended here
				html += `</div>`;
				html += `<div id="locked-msg" align="left" style="text-align:left"><b style="display:inline-block;text-align:center;width:1.5rem;">[L]</b> Locked: Cant Cut List <a href="options?L=${league_id}&amp;O=199" target="blank">Can't Cut List</a><br><b style="display:inline-block;text-align:center;width:1.5rem;">#</b> Locked: Global Lock<b style="display:inline-block;text-align:center;width:1.5rem;">*</b> Locked: Recently Dropped</div>`;

				html += `</div>`;

				html += `<div class="drop-player-container mobile-wrap">`;

				html += `<table align="center" class="report cus-drop-tableCap"><caption><span>Players to Drop</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
				if (dropHasSalary) {
					html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
				}
				html += `</div></th></tr></tbody></table>`;

				html += `<div id="drop-player-list"></div>`;
				// Drop List Players are appended here
				html += `</div>`;
				html += `</div>`;

				html += `</div>`;

				html += `</div>`;

				html += `<br>`;

				html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
				html += `<input id="clearAddList" type="button" value="Clear Roster" style="display:inline-block;margin:0!important">`;
				html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit" style="display:inline-block;margin:0!important;margin-right:.325rem!important;margin-left:.325rem!important;" disabled>`;
				html += `<input id="clearDropList" type="button" value="Clear Drops" style="display:inline-block;margin:0!important" disabled>`;
				html += `</div>`;

				html += `<br>`;

				html += `</form>`;

				if (appendHTML) {
					appendHTML.outerHTML = html;
				}

				// ADD FUNCTIONS

				function renderPlayerList(players, containerId, type) {
					const container = document.getElementById(containerId);
					if (!container) {
						console.warn(`â— Container ${containerId} not found.`);
						return;
					}
					container.textContent = ""; // Faster DOM clear

					let filtered = players;

					// Filter for "add"
					if (type === "add") {

						filtered.sort((a, b) => {
							const aPos = a.pos?.toUpperCase?.() || "";
							const bPos = b.pos?.toUpperCase?.() || "";
							const aRank = sortPlayerPosOrder[aPos] || 99;
							const bRank = sortPlayerPosOrder[bPos] || 99;

							if (aRank !== bRank) return aRank - bRank;

							const [alast, afirst] = a.name.split(", ");
							const [blast, bfirst] = b.name.split(", ");
							const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
							const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
							return aname.localeCompare(bname);
						});

						// Sort after filtering, if a sort key is set
						if (currentSortKeyAdd) {
							filtered.sort((a, b) => {
								let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
								let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

								if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
									// If value is 0, push to bottom
									if (aVal === 0 && bVal !== 0) return 1;
									if (bVal === 0 && aVal !== 0) return -1;
									if (aVal === 0 && bVal === 0) return 0;
								}

								return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
							});
						}
					}

					if (type === "drop") {
						filtered.sort((a, b) => {
							const aPos = a.pos?.toUpperCase?.() || "";
							const bPos = b.pos?.toUpperCase?.() || "";
							const aRank = sortPlayerPosOrder[aPos] || 99;
							const bRank = sortPlayerPosOrder[bPos] || 99;

							if (aRank !== bRank) return aRank - bRank;

							const [alast, afirst] = a.name.split(", ");
							const [blast, bfirst] = b.name.split(", ");
							const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
							const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
							return aname.localeCompare(bname);
						});

						if (currentSortKeyDrop) {
							filtered.sort((a, b) => {
								let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
								let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

								if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
									// If value is 0, push to bottom
									if (aVal === 0 && bVal !== 0) return 1;
									if (bVal === 0 && aVal !== 0) return -1;
									if (aVal === 0 && bVal === 0) return 0;
								}

								return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
							});
						}
					}

					// Use document fragment for efficiency
					const fragment = document.createDocumentFragment();

					filtered.forEach((p, index) => {
						const [lastRaw, firstRaw] = p.name.split(", ");
						let first = firstRaw?.trim() || "";
						let last = lastRaw?.trim() || "";

						const hasHash = first.includes("#") || last.includes("#");
						const hasAsterisk = first.includes("*") || last.includes("*");
						const hasLock = first.includes("^") || last.includes("^");

						const isRookie = first.includes("(R)") || last.includes("(R)");

						first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
						last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
						const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

						let statusSpan = "";
						if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
						if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
						if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

						const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
						const imageUrl = isSpecial ?
							`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
							`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

						const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (type === "drop") {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.roster ? ` &bull; Ros: ${p.roster}` : ''}</small>`;
						}
					} else {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.roster ? ` &bull; Ros: ${p.roster}` : ''}</small>`;
						}
					}

						const row = document.createElement("div");
						if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
						else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
						row.dataset.playerId = p.id;

						if (type === "add" && newDrop.some(d => d.id === p.id)) {
							row.classList.add("disabled-dropbox");
						}

						if (hasLock) {
							row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
						} else {
							row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Drop" : "Remove"}</button>`;
						}

						fragment.appendChild(row);
					});

					container.appendChild(fragment);
				}

				if (calendarRules) { // do not run if calendar rules say no add/drop at this time

					// AFTER addDropContainer.appendChild(newForm);
					const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

					if (enhancedUIContainer) {
						enhancedUIContainer.addEventListener("click", function (e) {
							const row = e.target.closest(".add-drop-player-row");
							if (!row || !enhancedUIContainer.contains(row)) return;

							const isAdd = !!row.closest("#add-player-list");
							const type = isAdd ? "add" : "drop";

							handlePlayerRowClick(row, type);
						});
					} else {
						console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
					}

					// Default to sorting Add list by WPROJ descending
					currentSortKeyAdd = "pos";
					sortDirectionAdd = 1;
					currentSortKeyDrop = "pos";
					sortDirectionDrop = 1;
					renderPlayerList(addPlayers, "add-player-list", "add");

					const sortBarAdd = document.querySelector('.sort-bar.add-list');
					const sortBarDrop = document.querySelector('.sort-bar.drop-list');

					// Update caret icon and activate class on WPROJ button
					const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="pos"]');
					if (pwptsBtnAdd) {
						const icon = pwptsBtnAdd.querySelector("i");
						icon.classList.add("fa-caret-down");
						pwptsBtnAdd.classList.add("activated");
					}

					// Update caret icon and activate class on WPROJ button
					const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
					if (pwptsBtnDrop) {
						const icon = pwptsBtnDrop.querySelector("i");
						icon.classList.add("fa-caret-down");
						pwptsBtnDrop.classList.add("activated");
					}

					sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
					sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							setTimeout(() => {
								document.body.appendChild(style);
							}, timeFrame);
						});
					});

					// Sort listeners (only for Add list)
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
						button.addEventListener("click", () => {
							const key = button.dataset.key;

							// Update direction
							if (currentSortKeyAdd === key) {
								sortDirectionAdd *= -1;
							} else {
								currentSortKeyAdd = key;
								sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
							}

							// Remove existing icons and active class
							sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
								btn.classList.remove("activated");
								const icon = btn.querySelector("i");
								icon.className = "fa-solid"; // reset
							});

							// Set the active button + caret
							button.classList.add("activated");
							const icon = button.querySelector("i");
							icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

							renderPlayerList(addPlayers, "add-player-list", "add");

							const addPlayerList = document.querySelector('#add-player-list');
							if (addPlayerList) {
								addPlayerList.scrollTo({
									top: 0
								});
							}
						});
					});
					// Sort listeners (only for Drop list)
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
						button.addEventListener("click", () => {
							const key = button.dataset.key;

							// Update direction
							if (currentSortKeyDrop === key) {
								sortDirectionDrop *= -1;
							} else {
								currentSortKeyDrop = key;
								sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
							}

							// Remove existing icons and active class
							sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
								btn.classList.remove("activated");
								const icon = btn.querySelector("i");
								icon.className = "fa-solid"; // reset
							});

							// Set the active button + caret
							button.classList.add("activated");
							const icon = button.querySelector("i");
							icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

							renderPlayerList(newDrop, "drop-player-list", "drop");
							const dropPlayerList = document.querySelector('#drop-player-list');
							if (dropPlayerList) {
								dropPlayerList.scrollTo({
									top: 0
								});
							}
						});
					});
				}

				function clearAllFromList(listId, type) {
					const container = document.getElementById(listId);
					if (!container) return;

					const rows = container.querySelectorAll(".add-drop-player-row");
					rows.forEach(row => {
						if (!row.classList.contains("disabled-locked")) {
							handlePlayerRowClick(row, type);
						}
					});
				}

				document.getElementById("clearAddList")?.addEventListener("click", () => {
					clearAllFromList("add-player-list", "add");
				});

				document.getElementById("clearDropList")?.addEventListener("click", () => {
					clearAllFromList("drop-player-list", "drop");
				});

				document.getElementById("add_drop_submit").addEventListener('click', function (e) {
					e.preventDefault(); // Prevent actual form submission

					if (!newDrop.length) return;

					const confirmDrop = confirm("Are you sure you want to drop these players?");
					if (!confirmDrop) return; // User canceled

					// Build drop_pid params from newDrop array
					const dropParams = newDrop
						.map(player => `drop_pid=${encodeURIComponent(player.id)}`)
						.join("&");

					const fullUrl = `${baseURLDynamic}/${year}/add_drop?LEAGUE_ID=${league_id}&FRANCHISE=${franchiseId}&OPTION=257&${dropParams}&SUBMIT=Drop+Players`;

					window.location.href = fullUrl;
				});

				function handlePlayerRowClick(row, type) {
					const playerId = row.dataset.playerId;
					if (!playerId) return;

					// Find player in addPlayers array by ID
					const player = addPlayers.find(p => p.id === playerId);
					if (!player) {
						console.warn("Player not found in addPlayers:", playerId);
						return;
					}

					// Check if player already exists in newDrop (by ID)
					const alreadyAdded = newDrop.some(p => p.id === playerId);

					if (type === "drop") {
						if (alreadyAdded) {
							// Remove player from newDrop
							newDrop = newDrop.filter(p => p.id !== playerId);
							renderPlayerList(newDrop, "drop-player-list", "drop");

							// Re-enable the corresponding add row
							const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
							if (addRow) {
								addRow.classList.remove("disabled-dropbox");
								//console.log(`Removed .disable from add row for player ${playerId}`);
							}
						}
					}
					if (type === "add") {
						// For add rows, only add if not already in the array
						if (!alreadyAdded) {
							newDrop.push(player);
							row.classList.add("disabled-dropbox");
							//console.log("Added player object to newDrop:", player);
							renderPlayerList(newDrop, "drop-player-list", "drop");
						} else {
							console.warn("This player is already in array:", playerId);
						}
					}

					const submitBtn = document.getElementById("add_drop_submit");
					if (submitBtn) {
						if (newDrop.length === 0) {
							submitBtn.disabled = true;
						} else {
							submitBtn.disabled = false;
						}
					}

					const clearBtn = document.getElementById("clearAddList");
					if (clearBtn) {
						const allAddRows = document.querySelectorAll("#add-player-list .add-drop-player-row");
						const allDisabled = Array.from(allAddRows).every(row =>
							row.classList.contains("disabled-dropbox") || row.classList.contains("disabled-locked")
						);
						clearBtn.disabled = allDisabled;
					}

					const clearRoster = document.getElementById("clearDropList");
					if (clearRoster) {
						if (newDrop.length === 0) {
							clearRoster.disabled = true;
						} else {
							clearRoster.disabled = false;
						}
					}

				}
			}
		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end drops page
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// cant add list
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "csetup_cantadd") {

	const style = document.createElement("style");
	style.textContent = `#csetup_cantadd table,#csetup_cantadd .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		const appendHTML = document.querySelector('form[action*="csetup"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		const addDropContainer = document.querySelector("#csetup_cantadd");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let currentSortKeyDrop = null;
			let sortDirectionAdd = 1;
			let sortDirectionDrop = 1;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``
			html += `<form id="AddDropForm" action="add_drop" method="POST">`;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Move Player To Can't Add List</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="fsrank">Rank <i class="fa-solid"></i></button>`;
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;
			html += `<div id="locked-msg" align="left" style="text-align:left"><b style="display:inline-block;text-align:center;width:2.5rem;">Hint: </b> Adding players to this list will not remove them from any rosters, to do so perform a drop transaction.</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-drop-tableCap"><caption><span>Current Can't Add List</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
			html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit" style="display:inline-block;margin:0!important;margin-right:.162rem!important">`;

			if (Array.isArray(curRoster) && curRoster.length === 0) {
				html += `<input id="clearDropList" type="button" value="Clear List" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
			} else {
				html += `<input id="clearDropList" type="button" value="Clear List" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
			}


			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {


					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}

				}

				if (type === "drop") {
					filtered.sort((a, b) => {
						const aPos = a.pos?.toUpperCase?.() || "";
						const bPos = b.pos?.toUpperCase?.() || "";
						const aRank = sortPlayerPosOrder[aPos] || 99;
						const bRank = sortPlayerPosOrder[bPos] || 99;

						if (aRank !== bRank) return aRank - bRank;

						const [alast, afirst] = a.name.split(", ");
						const [blast, bfirst] = b.name.split(", ");
						const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
						const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
						return aname.localeCompare(bname);
					});

					if (currentSortKeyDrop) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
							let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

							if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
						});
					}
				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (type === "drop") {
						infoLine = `<small>${p.nfl_team ?? 'FA'}</small>`;
					} else {
						infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
					}

					if (type === "drop") {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-myrank" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.fsrank)) ? p.fsrank : "&mdash;"}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					}

					fragment.appendChild(row);
				});

				container.appendChild(fragment);
			}


			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}

			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "fsrank";
			sortDirectionAdd = 1;
			currentSortKeyDrop = "pos";
			sortDirectionDrop = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');
			const sortBarDrop = document.querySelector('.sort-bar.drop-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="fsrank"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
			if (pwptsBtnDrop) {
				const icon = pwptsBtnDrop.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnDrop.classList.add("activated");
			}

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});
			// Sort listeners (only for Drop list)
			sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyDrop === key) {
						sortDirectionDrop *= -1;
					} else {
						currentSortKeyDrop = key;
						sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(curRoster, "drop-player-list", "drop");
					const dropPlayerList = document.querySelector('#drop-player-list');
					if (dropPlayerList) {
						dropPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});


			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});

			document.getElementById("add_drop_submit").addEventListener('click', function (e) {
				e.preventDefault(); // Prevent actual form submission

				//if (!curRoster.length) return;

				const confirmDrop = confirm("Are you sure you want to add these players to Can't Add List?");
				if (!confirmDrop) return; // User canceled

				// Build drop_pid params from curRoster array
				const dropParams = curRoster
					.map(player => `ROSTER=${encodeURIComponent(player.id)}`)
					.join("&");

				const fullUrl = `${baseURLDynamic}/${year}/csetup?L=${league_id}&C=CANTADD&${dropParams}&SUBMIT=Save+Can't+Add+List`;

				window.location.href = fullUrl;
			});

			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0) {
						//submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}

			}

		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end cant add list
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// cant cut list
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "csetup_cantcut") {

	const style = document.createElement("style");
	style.textContent = `#csetup_cantcut table,#csetup_cantcut .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		document.querySelectorAll('#csetup_cantcut table.report').forEach(table => {
			// Check if already wrapped
			if (table.parentElement?.classList.contains('mobile-wrap')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'mobile-wrap';

			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		});

		const appendHTML = document.querySelector('form[action*="csetup"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		const addDropContainer = document.querySelector("#csetup_cantcut");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			const inputYES = document.getElementById("AUTO_UPDATE_CANT_CUT_LIST_Yes");
			const inputNO = document.getElementById("AUTO_UPDATE_CANT_CUT_LIST_No");
			let inputYESHTML = null;
			let inputNOHTML = null;
			if (inputYES) {
				inputYESHTML = inputYES.outerHTML;
			}
			if (inputNO) {
				inputNOHTML = inputNO.outerHTML;
			}

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let currentSortKeyDrop = null;
			let sortDirectionAdd = 1;
			let sortDirectionDrop = 1;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``
			html += `<form id="AddDropForm" action="add_drop" method="POST">`;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Move Player To Can't Cut List</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="fsrank">Rank <i class="fa-solid"></i></button>`;
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `<div id="locked-msg" align="left" style="text-align:center">`;
			if (inputYESHTML && inputNOHTML) html += `<div class="checkboxFantasySharks">Auto update Can't Cuts daily from FantasySharks.com?<br>${inputYESHTML} <label for="AUTO_UPDATE_CANT_CUT_LIST_Yes">Yes</label> ${inputNOHTML} <label for="AUTO_UPDATE_CANT_CUT_LIST_No">No</label></div>`;
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-drop-tableCap"><caption><span>Current Can't Cut List</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (dropHasSalary) {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
			html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit" style="display:inline-block;margin:0!important;margin-right:.325rem!important">`;

			if (Array.isArray(curRoster) && curRoster.length === 0) {
				html += `<input id="clearDropList" type="button" value="Clear List" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
			} else {
				html += `<input id="clearDropList" type="button" value="Clear List" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
			}


			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {


					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}

				}

				if (type === "drop") {
					filtered.sort((a, b) => {
						const aPos = a.pos?.toUpperCase?.() || "";
						const bPos = b.pos?.toUpperCase?.() || "";
						const aRank = sortPlayerPosOrder[aPos] || 99;
						const bRank = sortPlayerPosOrder[bPos] || 99;

						if (aRank !== bRank) return aRank - bRank;

						const [alast, afirst] = a.name.split(", ");
						const [blast, bfirst] = b.name.split(", ");
						const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
						const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
						return aname.localeCompare(bname);
					});

					if (currentSortKeyDrop) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
							let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

							if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
						});
					}
				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (type === "drop") {
						infoLine = `<small>${p.nfl_team ?? 'FA'}</small>`;
					} else {
						infoLine = `<small>${p.nfl_team ?? 'FA'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
					}

					if (type === "drop") {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-myrank" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.fsrank)) ? p.fsrank : "&mdash;"}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					}

					fragment.appendChild(row);
				});

				container.appendChild(fragment);
			}

			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}

			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "fsrank";
			sortDirectionAdd = 1;
			currentSortKeyDrop = "pos";
			sortDirectionDrop = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');
			const sortBarDrop = document.querySelector('.sort-bar.drop-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="fsrank"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
			if (pwptsBtnDrop) {
				const icon = pwptsBtnDrop.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnDrop.classList.add("activated");
			}

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});
			// Sort listeners (only for Drop list)
			sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyDrop === key) {
						sortDirectionDrop *= -1;
					} else {
						currentSortKeyDrop = key;
						sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(curRoster, "drop-player-list", "drop");
					const dropPlayerList = document.querySelector('#drop-player-list');
					if (dropPlayerList) {
						dropPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});


			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});

			document.getElementById("add_drop_submit").addEventListener('click', function (e) {
				e.preventDefault(); // Prevent actual form submission

				//if (!curRoster.length) return;

				const confirmDrop = confirm("Are you sure you want to add these players to Can't Cut List?");
				if (!confirmDrop) return; // User canceled

				// Build drop_pid params from curRoster array
				const dropParams = curRoster
					.map(player => `ROSTER=${encodeURIComponent(player.id)}`)
					.join("&");

				const inputState = document.querySelector('input[name="AUTO_UPDATE_CANT_CUT_LIST"]:checked')?.value;

				const fullUrl = `${baseURLDynamic}/${year}/csetup?L=${league_id}&C=CANTCUT&AUTO_UPDATE_CANT_CUT_LIST=${inputState}&${dropParams}&SUBMIT=Save+Can't+Cut+List`;

				window.location.href = fullUrl;
			});

			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0) {
						//submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}

			}

		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end cant cut list
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// watchlist
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "options_178") {

	const style = document.createElement("style");
	style.textContent = `#body_options_178 table,#body_options_178 .mobile-wrap,#dropInputDiv{visibility:visible;}#body_options_178 .disabled-locked{display:none!important}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		let newDrop = [];

		const appendHTML = document.querySelector('form[action*="options"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}


		const addDropContainer = document.querySelector("#options_178");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			const watchlistTable = Array.from(document.querySelectorAll("table.report caption span"))
				.find(span => span.textContent.trim() === "My Watch List")
				?.closest("table");

			if (watchlistTable) {
				watchlistTable.id = "CurrentWatchList";
			}


			const deletePIDs = Array.from(document.querySelectorAll("#CurrentWatchList a[href*='ACTION=delete']"))
				.map(link => {
					try {
						return new URL(link.href).searchParams.get("PID");
					} catch (e) {
						return null;
					}
				})
				.filter(pid => pid);

			const watchListTable = addDropContainer.querySelector("#CurrentWatchList");

			if (watchListTable) {

				const wrapper = document.createElement("div");
				wrapper.className = "mobile-wrap requests-table";
				watchListTable.parentNode.insertBefore(wrapper, watchListTable);
				wrapper.appendChild(watchListTable);

				// Replace action links with icons
				const keywordMap = {
					"ACTION=move": {
						icon: "fa-regular fa-angle-up",
						title: "Move Player Up"
					},
					"ACTION=delete": {
						icon: "fa-regular fa-trash-xmark",
						title: "Delete This Player Request"
					}
				};

				watchListTable.querySelectorAll("td").forEach(td => {
					const matches = Array.from(td.querySelectorAll("a"))
						.map(link => {
							const href = link.getAttribute("href") || "";
							const keyword = Object.keys(keywordMap).find(k => href.includes(k));
							return keyword ? {
								link,
								keyword
							} : null;
						})
						.filter(Boolean);

					if (!matches.length) return;

					td.classList.add("action");
					td.textContent = "";

					matches.forEach(({
						link,
						keyword
					}, i) => {
						const {
							icon,
							title
						} = keywordMap[keyword];
						const newLink = document.createElement("a");
						newLink.href = link.href;
						newLink.title = title;
						const iconElem = document.createElement("i");
						icon.split(" ").forEach(cls => iconElem.classList.add(cls));
						iconElem.setAttribute("aria-hidden", "true");
						newLink.appendChild(iconElem);
						td.appendChild(newLink);
						if (i < matches.length - 1) td.appendChild(document.createTextNode(" "));
					});
				});


			}

			const copyYear = addDropContainer.querySelector("#COPY_YEAR");
			const copyLeague = addDropContainer.querySelector("#COPY_LEAGUE");

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let currentSortKeyDrop = null;
			let sortDirectionAdd = 1;
			let sortDirectionDrop = 1;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``
			html += `<form id="AddDropForm" action="add_drop" method="POST">`;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Select Player For My Watchlist</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (addHasSalary) {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-drop-tableCap"><caption><span>Add To My Watchlist</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (dropHasSalary) {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			if (copyYear && copyLeague) {
				html += `<div class="mobile-wrap">`;
				html += `<table class="report" cellspacing="0" cellpadding="0" border="0">`;
				html += `<caption><span>Copy Watchlist From Another League</span></caption>`;
				html += `<tbody><tr><th colspan="2">Enter Year and League ID</th></tr>`;
				html += `<tr class="oddtablerow"><td style="width: 1%;white-space: nowrap;">Year of League To Copy From:</td><td>${copyYear?.outerHTML || ''}</td></tr>`;
				html += `<tr class="eventablerow"><td style="width: 1%;white-space: nowrap;">League ID To Copy From:</td><td>${copyLeague?.outerHTML || ''}</td></tr>`;
				html += `</tr><td colspan="2"><span class="hint warning"><b>Hint: </b></span>When copying players from another league, these players will be added to the current players on this league's list.</td></tr>`;
				html += `</tbody></table>`;
				html += `</div>`;
			}

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
			html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit" style="display:inline-block;margin:0!important;margin-right:.325rem!important;">`;
			html += `<input id="clearDropList" type="button" value="Clear Watchlist" style="display:inline-block;margin:0!important;margin-left:.325rem!important;">`;
			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {

					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}
				}

				if (type === "drop") {
					filtered.sort((a, b) => {
						const aPos = a.pos?.toUpperCase?.() || "";
						const bPos = b.pos?.toUpperCase?.() || "";
						const aRank = sortPlayerPosOrder[aPos] || 99;
						const bRank = sortPlayerPosOrder[bPos] || 99;

						if (aRank !== bRank) return aRank - bRank;

						const [alast, afirst] = a.name.split(", ");
						const [blast, bfirst] = b.name.split(", ");
						const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
						const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
						return aname.localeCompare(bname);
					});

					if (currentSortKeyDrop) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
							let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

							if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
						});
					}
				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (p.sal) {
						infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.fsrank)) ? ` &bull; Rank: ${parseFloat(p.fsrank)}` : ' &bull; Rank: N/A'}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
					} else {
						infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.fsrank)) ? ` &bull; Rank: ${parseFloat(p.fsrank)}` : ' &bull; Rank: N/A'}</small>`;
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && (newDrop.some(d => d.id === p.id) || deletePIDs.includes(p.id))) {
						row.classList.add("disabled-locked");
					}

					if (hasLock) {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Remove"}</button>`;
					}

					fragment.appendChild(row);
				});

				container.appendChild(fragment);
			}

			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}

			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "projpts";
			sortDirectionAdd = -1;
			currentSortKeyDrop = "pos";
			sortDirectionDrop = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');
			const sortBarDrop = document.querySelector('.sort-bar.drop-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="projpts"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
			if (pwptsBtnDrop) {
				const icon = pwptsBtnDrop.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnDrop.classList.add("activated");
			}

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});
			// Sort listeners (only for Drop list)
			sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyDrop === key) {
						sortDirectionDrop *= -1;
					} else {
						currentSortKeyDrop = key;
						sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(newDrop, "drop-player-list", "drop");
					const dropPlayerList = document.querySelector('#drop-player-list');
					if (dropPlayerList) {
						dropPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});

			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});

			document.getElementById("add_drop_submit").addEventListener('click', function (e) {
				e.preventDefault(); // Prevent actual form submission

				const copyYearSelect = document.getElementById("COPY_YEAR");
				const copyLeagueInput = document.getElementById("COPY_LEAGUE");
				const copyYear = copyYearSelect?.value || ""; // fallback to blank if not found
				const copyLeague = copyLeagueInput?.value?.trim() || ""; // fallback to blank if not found
				const isValid = /^\d{5}$/.test(copyLeague);

				if (isValid && !newDrop.length) {
					console.log("allow owner to submit");
				} else if (!isValid && newDrop.length) {
					console.log("allow owner to submit");
				} else if (isValid && newDrop.length) {
					console.log("allow owner to submit");
				} else {
					alert("You must enter a player to watch or input a league ID to copy");
					return
				}

				const confirmDrop = confirm("Are you sure you want to watch these players?");
				if (!confirmDrop) return; // User canceled

				// Build drop_pid params from newDrop array
				const dropParams = newDrop
					.map(player => `PID=${encodeURIComponent(player.id)}`)
					.join("&");

				const fullUrl = `${baseURLDynamic}/${year}/options?L=${league_id}&ACTION=add&O=178&${dropParams}&COPY_YEAR=${copyYear}&COPY_LEAGUE=${copyLeague}&submit=Add+To+My+Watch+List`;

				window.location.href = fullUrl;
			});


			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					return;
				}

				// Check if player already exists in newDrop (by ID)
				const alreadyAdded = newDrop.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from newDrop
						newDrop = newDrop.filter(p => p.id !== playerId);
						renderPlayerList(newDrop, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						newDrop.push(player);
						row.classList.add("disabled-dropbox");
						//console.log("Added player object to newDrop:", player);
						renderPlayerList(newDrop, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (newDrop.length === 0) {
						//submitBtn.disabled = true;
					} else {
						//submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (newDrop.length === 0) {
						//clearRoster.disabled = true;
					} else {
						//clearRoster.disabled = false;
					}
				}

			}
		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end drops page
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// load rosters
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (thisProgram === "load_rosters") {
	document.querySelectorAll('#load_rosters table.report').forEach(table => {
		// Check if already wrapped
		if (table.parentElement?.classList.contains('mobile-wrap')) return;

		const wrapper = document.createElement('div');
		wrapper.className = 'mobile-wrap';

		table.parentNode.insertBefore(wrapper, table);
		wrapper.appendChild(table);
	});
}

if (thisProgram === "csetup_loadrost") {

	const style = document.createElement("style");
	style.textContent = `#csetup_loadrost table,#csetup_loadrost .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		const appendHTML = document.querySelector('form[action*="load_rosters"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		const addDropContainer = document.querySelector("#csetup_loadrost");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			let franchiseId = document.querySelector('input[name="FRANCHISE_ID"]')?.value || "";
			if (!franchiseId) {
				franchiseId = franchise_id;
			}
			const franchiseKey = `fid_${franchiseId}`;
			const franchiseObj = franchiseDatabase[franchiseKey];
			const franchiseName = franchiseObj?.name || "Unknown Franchise";

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let currentSortKeyDrop = null;
			let sortDirectionAdd = 1;
			let sortDirectionDrop = 1;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``
			html += `<form id="AddDropForm" action="add_drop" method="POST">`;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Select Player To Load</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="fsrank">Rank <i class="fa-solid"></i></button>`;
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `<div id="locked-msg" align="left" style="text-align:center">`;
			html += `<div><b style="display:inline-block;text-align:center;width:2.5rem;">Hint: </b> Can't find a player on this list?<br>You can <a href="player_search?L=${league_id}" target="_blank">search our player database</a> to try to find him.</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-drop-tableCap"><caption><span>${franchiseName} Roster</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (dropHasSalary) {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;


			html += `<div id="loadText" class="mobile-wrap">`;
			html += `<table align="center" class="report selected-moves">`;
			html += `<caption><span>Manually Load Players</span></caption>`;
			html += `<tbody>`;
			html += `<tr><th colspan="100">You may copy/paste (or type in) player names here, one player name per line</th></tr>`;
			html += `<tr>`;
			html += `<td><textarea style="width:100%" rows="8" cols="40" name="PLAYER_NAMES"></textarea></td>`;
			html += `</tr></tbody></table></div>`;

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
			html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit" style="display:inline-block;margin:0!important;margin-right:.325rem!important">`;

			if (Array.isArray(curRoster) && curRoster.length === 0) {
				html += `<input id="clearDropList" type="button" value="Clear List" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
			} else {
				html += `<input id="clearDropList" type="button" value="Clear List" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
			}


			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {


					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}

				}

				if (type === "drop") {
					filtered.sort((a, b) => {
						const aPos = a.pos?.toUpperCase?.() || "";
						const bPos = b.pos?.toUpperCase?.() || "";
						const aRank = sortPlayerPosOrder[aPos] || 99;
						const bRank = sortPlayerPosOrder[bPos] || 99;

						if (aRank !== bRank) return aRank - bRank;

						const [alast, afirst] = a.name.split(", ");
						const [blast, bfirst] = b.name.split(", ");
						const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
						const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
						return aname.localeCompare(bname);
					});

					if (currentSortKeyDrop) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
							let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

							if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
						});
					}


				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (type === "drop") {
						infoLine = `<small>${p.nfl_team ?? 'FA'}</small>`;
					} else {
						infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
					}

					if (type === "drop") {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-myrank" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.fsrank)) ? p.fsrank : "&mdash;"}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					}
					fragment.appendChild(row);
				});

				container.appendChild(fragment);
			}

			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}

			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "fsrank";
			sortDirectionAdd = 1;
			currentSortKeyDrop = "pos";
			sortDirectionDrop = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');
			const sortBarDrop = document.querySelector('.sort-bar.drop-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="fsrank"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
			if (pwptsBtnDrop) {
				const icon = pwptsBtnDrop.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnDrop.classList.add("activated");
			}

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});
			// Sort listeners (only for Drop list)
			sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyDrop === key) {
						sortDirectionDrop *= -1;
					} else {
						currentSortKeyDrop = key;
						sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(curRoster, "drop-player-list", "drop");
					const dropPlayerList = document.querySelector('#drop-player-list');
					if (dropPlayerList) {
						dropPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});


			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});


			document.getElementById("add_drop_submit").addEventListener('click', function (e) {
				e.preventDefault(); // Prevent actual form submission

				const confirmDrop = confirm("Are you sure you want to add/drop these to this roster?");
				if (!confirmDrop) return; // User canceled

				// Build drop_pid params from curRoster array
				const dropParams = curRoster
					.map(player => `ROSTER=${encodeURIComponent(player.id)}`)
					.join("&");

				// Check for PLAYER_NAMES text area and get its value
				const playerNamesTextarea = document.querySelector('textarea[name="PLAYER_NAMES"]');
				const playerNames = playerNamesTextarea?.value?.trim() || "";

				const fullUrl = `${baseURLDynamic}/${year}/load_rosters?L=${league_id}&FRANCHISE_ID=${franchiseId}&C=LOADROST&${dropParams}&PLAYER_NAMES=${encodeURIComponent(playerNames)}`;

				window.location.href = fullUrl;
			});


			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0) {
						//submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}

			}
		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end load rosters
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// my draft list
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "options_129") {
	const style = document.createElement("style");
	style.textContent = `#options_129 table,#options_129 .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {

		document.querySelectorAll('#options_129 table.report').forEach(table => {
			// Check if already wrapped
			if (table.parentElement?.classList.contains('mobile-wrap')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'mobile-wrap';

			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		});

		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		document.querySelectorAll('#options_129 table.report').forEach(table => {
			// Check if already wrapped
			if (table.parentElement?.classList.contains('mobile-wrap')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'mobile-wrap';

			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		});

		const appendHTML = document.querySelector('form[action*="my_draft_list"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		const addDropContainer = document.querySelector("#options_129");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let sortDirectionAdd = 1;

			const hostOnly = new URL(baseURLDynamic).host;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``
			html += `<form id="AddDropForm"  action="${baseURLDynamic}/${year}/my_draft_list" method="post" name="my_draft_list">`;
			html += `<input type="hidden" name="L" value="${league_id}">`;
			html += `<input type="hidden" name="O" value="129">`;
			html += `<input type="hidden" name="FRANCHISE_ID" value="${franchise_id}">`;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Move Players To My Draft List</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (addHasSalary) {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="adp">ADP <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="adp">ADP <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `<div id="locked-msg" align="left" style="text-align:center">`;
			html += `<div class="checkboxFantasySharks">Looking for draft advice?  Check out<br><a href="https://www.fantasysharks.com/apps/Remora/draftcoach.php?league=${league_id}&team=${franchise_id}&host=${hostOnly}" target="_blank">FantasySharks Draft Coach</a> or <a href="https://www.fantasysharks.com/apps/Remora/draftguideHTML.php?L=${league_id}&T=${franchise_id}&H=${hostOnly}" target="_blank">FantasySharks Draft Guide</a>.</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>My Draft List</span></caption><tbody><tr><th><div class="sort-bar drop-list"><div class="dropThtext" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%">Sort The Order Of Your Draft Rankings</div><span style="visibility:hidden!important">Sort by:</span><button style="visibility:hidden!important" type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button style="visibility:hidden!important" type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;

			html += `</div></th></tr></tbody></table>`;


			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
			html += `<input id="add_drop_submit" type="submit" name="save" value="Save My Draft List" style="display:inline-block;margin:0!important;margin-right:.162rem!important">`;

			if (Array.isArray(curRoster) && curRoster.length === 0) {
				html += `<input id="clearDropList" type="button" value="Clear Draft List" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
			} else {
				html += `<input id="clearDropList" type="button" value="Clear Draft List" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
			}


			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {

					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}


				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					if (type === "drop") {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small><input type="hidden" name="PLAYERS" value="${p.id}"><div class="moveBtns"><button type="button" class="move-up-btn" title="Move Player Up 1 Spot">â†‘</button><button type="button" class="move-up-btn-twenty" title="Move Player Up 20 Spots">â†‘ 20</button><button type="button" class="move-down-btn" title="Move Player Down 1 Spot">â†“</button><button type="button" class="move-down-btn-twenty" title="Move Player Down 20 Spots">â†“ 20</button><button type="button" class="move-Up-down-btn-twenty" title="Move Player 20 Spots">â†‘ 20 â†“</button></div>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small><input type="hidden" name="PLAYERS" value="${p.id}"><div class="moveBtns"><button type="button" class="move-up-btn" title="Move Player Up 1 Spot">â†‘</button><button type="button" class="move-up-btn-twenty" title="Move Player Up 20 Spots">â†‘ 20</button><button type="button" class="move-down-btn" title="Move Player Down 1 Spot">â†“</button><button type="button" class="move-down-btn-twenty" title="Move Player Down 20 Spots">â†“ 20</button><button type="button" class="move-Up-down-btn-twenty" title="Move Player 20 Spots">â†‘ 20 â†“</button></div>`;
						}
					} else {

						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
						}
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
					}

					if (hasLock) {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Remove"}</button>`;
					}

					fragment.appendChild(row);
				});

				container.appendChild(fragment);

				if (type === "drop") {
					if (Array.isArray(curRoster) && curRoster.length < 7) {
						container.classList.add("showFilters");
					} else {
						container.classList.remove("showFilters");
					}
				}
			}


			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					// ðŸš« For "drop" rows, only trigger if clicking .select-btn
					if (type === "drop" && !e.target.classList.contains("select-btn")) return;

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}


			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "projpts";
			sortDirectionAdd = -1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="projpts"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});

			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});

			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							addRow.style.display = "";
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0) {
						//submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}

			}

			document.getElementById("drop-player-list").addEventListener("click", function (e) {
				const btn = e.target;
				const row = btn.closest(".add-drop-player-row");
				if (!row) return;

				const parent = row.parentNode;
				const allRows = Array.from(parent.querySelectorAll(".add-drop-player-row"));
				const index = allRows.indexOf(row);

				const submitBtn = document.getElementById("add_drop_submit");

				if (btn.classList.contains("move-up-btn")) {
					const prev = row.previousElementSibling;
					if (prev && prev.classList.contains("add-drop-player-row")) {
						parent.insertBefore(row, prev);
						sortSyncCurRosterOrder();
					}
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-down-btn")) {
					const next = row.nextElementSibling;
					if (next && next.classList.contains("add-drop-player-row")) {
						parent.insertBefore(next, row);
						sortSyncCurRosterOrder();
					}
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-up-btn-twenty")) {
					let targetIndex = index - 20;
					if (targetIndex < 0) targetIndex = 0;
					const targetRow = allRows[targetIndex];
					parent.insertBefore(row, targetRow);
					sortSyncCurRosterOrder();
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-down-btn-twenty")) {
					let targetIndex = index + 20;
					if (targetIndex >= allRows.length) {
						parent.appendChild(row);
					} else {
						const targetRow = allRows[targetIndex];
						parent.insertBefore(row, targetRow.nextSibling);
					}
					sortSyncCurRosterOrder();
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-Up-down-btn-twenty")) {
					// Remove any existing prompt
					const existingPrompt = document.querySelector(".move-20-prompt");
					if (existingPrompt) existingPrompt.remove();

					// Create prompt container
					const promptDiv = document.createElement("div");
					promptDiv.className = "move-20-prompt oddtablerow";
					promptDiv.style.cssText = `padding:.25rem;display:flex;align-items:center;gap:.25rem;margin:.25rem 0`;

					promptDiv.innerHTML = `<strong style="white-space:nowrap;font-size:1rem;font-weight:40">Move Player:</strong><select id="move-20-select" style="width:100%!important;padding:0!important;height:2rem;"><option value="">Direction</option><option value="up">â†‘ Up 20</option><option value="down">â†“ Down 20</option></select><button style="padding:.1875rem;height:2rem;" type="button" id="confirm-move-20">Confirm</button><button type="button" id="cancel-move-20" style="padding:.1875rem;height:2rem;">Cancel</button>`;

					// Insert the prompt after the entire .add-drop-player-row
					row.insertAdjacentElement("afterend", promptDiv);

					// Confirm handler
					promptDiv.querySelector("#confirm-move-20").addEventListener("click", () => {
						const direction = promptDiv.querySelector("#move-20-select").value;
						promptDiv.remove();

						if (direction === "up") {
							let targetIndex = index - 20;
							if (targetIndex < 0) targetIndex = 0;
							const targetRow = allRows[targetIndex];
							parent.insertBefore(row, targetRow);
							sortSyncCurRosterOrder();
						} else if (direction === "down") {
							let targetIndex = index + 20;
							if (targetIndex >= allRows.length) {
								parent.appendChild(row);
							} else {
								const targetRow = allRows[targetIndex];
								parent.insertBefore(row, targetRow.nextSibling);
							}
							sortSyncCurRosterOrder();
						}
					});

					// Cancel handler
					promptDiv.querySelector("#cancel-move-20").addEventListener("click", () => {
						promptDiv.remove();
					});
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

			});
		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end my draft list
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


/*
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// Make Draft Pick
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "options_52" || thisProgram === "new_predraft") {
	const style = document.createElement("style");
	style.textContent = `#options_52 table,#options_52 .mobile-wrap,#new_predraft table,#new_predraft .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		document.querySelectorAll('#new_predraft table.report').forEach(table => {
			// Check if already wrapped
			if (table.parentElement?.classList.contains('mobile-wrap')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'mobile-wrap';

			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		});

		let formEl = document.querySelector('form[action*="draft"]:not([action*="new_predraft"])');
		let franchiseOnClock = !!formEl;

		if (!formEl) {
			formEl = document.querySelector('form[action*="new_predraft"]');
		}

		// Use the parent <table> if available, otherwise use the form itself
		let appendHTML = formEl ? formEl.closest('table') || formEl : null;

		if (franchiseOnClock) {
			document.body.classList.add("draftNow");
		}

		appendHTML.querySelectorAll('img.franchiseicon').forEach(img => {
			const altText = img.getAttribute('alt') || '';
			const textNode = document.createTextNode(altText);
			img.replaceWith(textNode);
		});

		const captions = appendHTML.querySelectorAll("caption");
		const headers = appendHTML.querySelectorAll("h3");
		let draftPickTxt = "";
		let selectionsForTxt = "";
		let waitingForTxt = "";
		let onDeckTxt = "";
		let yourTurnTxt = "";

		captions.forEach(caption => {
			if (caption.textContent.includes("Draft Pick")) {
				const span = caption.querySelector("span");
				draftPickTxt = span ? span.innerHTML : caption.innerHTML;
			}
			if (caption.textContent.includes("Selections For")) {
				const span = caption.querySelector("span");
				selectionsForTxt = span ? span.innerHTML : caption.innerHTML;
			}
			if (caption.textContent.includes("It's Your Turn")) {
				const span = caption.querySelector("span");
				yourTurnTxt = span ? span.innerHTML : caption.innerHTML;
			}
		});

		headers.forEach(header => {
			if (header.textContent.includes("Waiting For")) {
				waitingForTxt = header.innerHTML;
			}
			if (header.textContent.includes("On Deck")) {
				onDeckTxt = header.innerHTML;
			}
		});


		if (waitingForTxt) {
			//html += `<div>${waitingForTxt}</div>`;
		}


		let addDropContainer = document.querySelector("#options_52");
		if (!addDropContainer) {
			addDropContainer = document.querySelector("#new_predraft");
		}

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let sortDirectionAdd = 1;
			let hadPlayers = false;

			let sortMyRank = picker_sortby === "myrank";

			const hostOnly = new URL(baseURLDynamic).host;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let franchiseId = document.querySelector('input[name="FRANCHISE_ID"]')?.value || "";
			if (!franchiseId) {
				franchiseId = franchise_id;
			}
			const franchiseKey = `fid_${franchiseId}`;
			const franchiseObj = franchiseDatabase[franchiseKey];
			const franchiseName = franchiseObj?.name || "Unknown Franchise";

			const roundInput = document.querySelector('input[name="ROUND"]');
			const maxRoundsInput = document.querySelector('input[name="MAX_ROUNDS"]');
			const allDraftPicksInput = document.querySelector('input[name="ALL_DRAFT_PICKS"]');
			const skipInput = document.querySelector('input[name="SKIP_PICK"][type="submit"]');

			let html = ``;

			if (!franchiseOnClock) {

				html += `<div class="mobile-wrap"><table id="draftDetails" align="center" class="report"><caption><span>Draft Details</span></caption><tbody>`;

				let rowCount = 0;

				html += `<tr><th>Speed Up Your Overall Draft Pace, Pre-Draft Below !</th></tr>`;

				if (draftPickTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${draftPickTxt}</td></tr>`;
				}

				if (selectionsForTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${selectionsForTxt}</td></tr>`;
				}

				if (waitingForTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${waitingForTxt}</td></tr>`;
				}

				if (onDeckTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${onDeckTxt}</td></tr>`;
				}

				html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>Pre-draft picks are selected for you as soon as it's your turn to pick !!</td></tr>`;
				html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>Not sure what to do? <button style="cursor:pointer" id="helpMe">Open Help</button></td></tr>`;

				html += `<tr class="showHideRow ${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}" style="display:none">`;
				html += `<td>1) From the "Select Player To Pre-Draft" list, select the player you would like to draft.</td>`;
				html += `</tr>`;
				html += `<tr class="showHideRow ${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}" style="display:none">`;
				html += `<td>2) Repeat step 1 above for any pick you'd like to attempt in this round.  Keep in mind, the more picks you specify, the better your chances of getting a player.</td>`;
				html += `</tr>`;
				html += `<tr class="showHideRow ${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}" style="display:none">`;
				html += `<td>3) Once you're done, you may change the priority order for your picks using the up and down arrow buttons.  Or, you may remove a pick by clicking on the Remove button.</td>`;
				html += `</tr>`;
				html += `<tr class="showHideRow ${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}" style="display:none">`;
				html += `<td>4) Now that your picks are prioritized, click on the "Save Picks and Continue" button to get confirmation of your picks.</td>`;
				html += `</tr>`;
				html += `<tr class="showHideRow ${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}" style="display:none">`;
				html += `<td>5) If you'd like to make additional picks for this round or other rounds, you will be given the opportunity to make those picks at this time.</td>`;
				html += `</tr>`;
				html += `</tbody></table></div>`;
			}

			if (franchiseOnClock) {

				html += `<div class="mobile-wrap"><table id="draftDetails" align="center" class="report"><caption><span>Draft Details</span></caption><tbody>`;

				let rowCount = 0;

				html += `<tr><th>Speed Up Your Draft Pace, Pre-Draft after you pick !</th></tr>`;

				if (draftPickTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${draftPickTxt}</td></tr>`;
				}

				if (selectionsForTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${selectionsForTxt}</td></tr>`;
				}

				if (waitingForTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${waitingForTxt}</td></tr>`;
				}

				if (onDeckTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${onDeckTxt}</td></tr>`;
				}

				if (yourTurnTxt) {
					html += `<tr class="${rowCount++ % 2 === 0 ? 'oddtablerow' : 'eventablerow'}"><td>${yourTurnTxt}</td></tr>`;
				}

				html += `</tbody></table></div>`;

				html += `<form id="AddDropForm" class="draftPageForm" action="${baseURLDynamic}/${year}/draft" method="post">`;
				html += `<input type="hidden" name="LEAGUE_ID" value="${league_id}">`;
				html += `<input type="hidden" name="FRANCHISE_ID" value="${franchiseId}">`;
				html += `<input type="hidden" name="OPTION" value="52">`;
				if (roundInput) {
					html += `<input type="hidden" name="ROUND" value="${roundInput.value}">`;
				}
				if (maxRoundsInput) {
					html += `<input type="hidden" name="MAX_ROUNDS" value="${maxRoundsInput.value}">`;
				}
				if (allDraftPicksInput) {
					html += `<input type="hidden" name="ALL_DRAFT_PICKS" value="${allDraftPicksInput.value}">`;
				}
			} else {
				html += `<form id="AddDropForm" class="draftPageForm" action="${baseURLDynamic}/${year}/new_predraft" method="post" name="new_predraft">`;
				html += `<input type="hidden" name="LEAGUE_ID" value="${league_id}">`;
				html += `<input type="hidden" name="FRANCHISE_ID" value="${franchiseId}">`;
				if (roundInput) {
					html += `<input type="hidden" name="ROUND" value="${roundInput.value}">`;
				}
				if (maxRoundsInput) {
					html += `<input type="hidden" name="MAX_ROUNDS" value="${maxRoundsInput.value}">`;
				}
				if (allDraftPicksInput) {
					html += `<input type="hidden" name="ALL_DRAFT_PICKS" value="${allDraftPicksInput.value}">`;
				}
			}

			html += `<div id="enhanced-add-drop-ui" style="text-align:left!important">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			if (franchiseOnClock) {
				html += `<table align="center" class="report cus-add-tableCap"><caption><span>Select A Player To Draft - Your UP!!</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			} else {
				html += `<table align="center" class="report cus-add-tableCap"><caption><span>Select Player To Pre-Draft</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			}
			if (addHasSalary) {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button>`;
				if (sortMyRank) {
					html += `<button type="button" class="sort-btn add-list" data-key="myrank">My Rank <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn add-list" data-key="fsrank">Rank <i class="fa-solid"></i></button>`;
				}
				html += `<button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="adp">ADP <i class="fa-solid"></i></button>`;

			} else {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button>`;
				if (sortMyRank) {
					html += `<button type="button" class="sort-btn add-list" data-key="myrank">My Rank <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn add-list" data-key="fsrank">Rank <i class="fa-solid"></i></button>`;
				}
				html += `<button type="button" class="sort-btn add-list" data-key="adp">ADP <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `<div id="locked-msg" align="left" style="text-align:center">`;
			html += `<div class="checkboxFantasySharks"><b>*</b> Locked Player due to having been recently dropped.<br>Check <a href="locked_players?L=${league_id}" target="_blank">Locked Players</a> report for info as to when they unlock.</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			if (franchiseOnClock) {
				html += `<table align="center" class="report cus-add-tableCap"><caption><span>Player To Draft</span></caption><tbody><tr><th><div class="sort-bar drop-list"><div class="dropThtext" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%">Click "Draft Player" To Submit Pick</div><span style="visibility:hidden!important">Sort by:</span><button style="visibility:hidden!important" type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button style="visibility:hidden!important" type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			} else {
				html += `<table align="center" class="report cus-add-tableCap"><caption><span>Players Queued For Selection</span></caption><tbody><tr><th><div class="sort-bar drop-list"><div class="dropThtext" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%">Place in order you want drafted</div><span style="visibility:hidden!important">Sort by:</span><button style="visibility:hidden!important" type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button style="visibility:hidden!important" type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			}

			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			if (franchiseOnClock) {
				html += `<table align="center" class="report"><caption><span>Add Message For Your Pick</span></caption><tbody><tr><th>Optional Pick Comments:</th></tr><tr><td><textarea rows="5" cols="70" name="MSG"></textarea></td></tr></tbody></table>`;
				html += `<div id="locked-msg" align="left" style="text-align:center">`;
				html += `<div class="checkboxFantasySharks">Looking for draft advice?  Check out<br><a href="https://www.fantasysharks.com/apps/Remora/draftcoach.php?league=${league_id}&team=${franchiseId}&host=${hostOnly}" target="_blank">FantasySharks Draft Coach</a> or <a href="https://www.fantasysharks.com/apps/Remora/draftguideHTML.php?L=${league_id}&T=${franchiseId}&H=${hostOnly}" target="_blank">FantasySharks Draft Guide</a>.</div>`;
				html += `</div>`;
			}

			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			html += `<div class="mobile-wrap" id="curRosterTable" style="display:none"></div>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;

			if (franchiseOnClock) {
				html += `<input id="add_drop_submit" disabled type="submit" value="Draft Player" onclick="return confirm('Are you sure you want to draft this player?');" style="display:inline-block;margin:0!important;margin-right:.162rem!important">`;
				if (skipInput) {
					const clickValue = skipInput.getAttribute('onclick') || '';
					html += `<input name="SKIP_PICK" type="submit" value="Skip Pick" onclick="${clickValue}" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
				}
				hadPlayers = false;
			} else {
				if (Array.isArray(curRoster) && curRoster.length === 0) {
					html += `<input id="add_drop_submit" disabled type="submit" name="save" value="Save Picks And Continue" style="display:inline-block;margin:0!important;margin-right:.162rem!important">`;
					html += `<input id="clearDropList" type="button" value="Clear Draft Que" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
					hadPlayers = false;
				} else {
					html += `<input id="add_drop_submit" disabled type="submit" name="save" value="Save Picks And Continue" style="display:inline-block;margin:0!important;margin-right:.162rem!important">`;
					html += `<input id="clearDropList" type="button" value="Clear Draft Que" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
					hadPlayers = true;
				}
			}

			html += `</div>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const hasRosterTable = document.getElementById("curRosterTable");

			const url = `${baseURLDynamic}/${year}/options?L=${league_id}&O=07&PRINTER=1`;

			fetch(url)
				.then(res => res.text())
				.then(rawHTML => {
					const parser = new DOMParser();
					const doc = parser.parseFromString(rawHTML, "text/html");

					const targetLink = doc.querySelector(`a.franchise_${franchiseId}`);
					if (!targetLink) {
						console.warn("Franchise link not found for ID:", franchiseId);
						return;
					}

					const targetTable = targetLink.closest("table.report");
					if (!targetTable) {
						console.warn("No table.report found near that franchise link");
						return;
					}

					const roterCloneTable = targetTable.cloneNode(true);

					const oldCaption = roterCloneTable.querySelector("caption");
					if (oldCaption) {
						const newCaption = document.createElement("caption");
						newCaption.innerHTML = `<span>${franchiseName} Roster</span>`;
						oldCaption.replaceWith(newCaption);
					}

					// Remove &PRINTER=1 from all anchor tags
					const anchorTags = roterCloneTable.querySelectorAll('a[href*="PRINTER=1"]');
					anchorTags.forEach(a => {
						const url = new URL(a.href, location.origin);
						url.searchParams.delete("PRINTER");
						a.href = url.pathname + url.search;
					});

					if (hasRosterTable) {
						const roterstyle = document.createElement("style");
						roterstyle.textContent = `#curRosterTable table a{text-decoration:none;cursor:default;pointer-events:none}#curRosterTable table.cus_player_images a{text-decoration:none;cursor:pointer;pointer-events:all}#curRosterTable table img{display:none}#curRosterTable table td:nth-child(n+2),#curRosterTable table th:nth-child(n+2){display:none}#curRosterTable table.cus_player_images img{display:inline-table}#curRosterTable table.cus_player_images td.player td{display:table-cell}#curRosterTable table td,#curRosterTable table th{text-align:left!important}#curRosterTable table td.week,#curRosterTable table th.week{text-align:center!important}#curRosterTable{max-width:31.25rem}#curRosterTable table td.drafted,#curRosterTable table th.drafted,#curRosterTable table td.week,#curRosterTable table th.week{display:table-cell}`;
						document.body.appendChild(roterstyle);
						hasRosterTable.insertAdjacentHTML("beforeend", roterCloneTable.outerHTML);
						hasRosterTable.style.display = "block";
					}
				})
				.catch(err => {
					console.error("Failed to fetch or parse roster report:", err);
				});

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			const numericSortKeys = new Set(["name", "pos", "nfl_team"]);

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {

					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts" || currentSortKeyAdd === "myrank") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}

				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = ``

					if (type === "drop") {
						if (p.sal) {
							infoLine += `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
							if (franchiseOnClock) {
								infoLine += `<input type="hidden" name="PLAYER_PICK" value="${p.id}">`;
							} else {
								infoLine += `<input type="hidden" name="PICKS" value="${p.id}"><div class="moveBtns"><button type="button" class="move-up-btn" title="Move Player Up 1 Spot">â†‘</button><button type="button" class="move-up-btn-twenty" title="Move Player Up 20 Spots">â†‘ 20</button><button type="button" class="move-down-btn" title="Move Player Down 1 Spot">â†“</button><button type="button" class="move-down-btn-twenty" title="Move Player Down 20 Spots">â†“ 20</button><button type="button" class="move-Up-down-btn-twenty" title="Move Player 20 Spots">â†‘ 20 â†“</button></div>`;
							}
						} else {
							infoLine += `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
							if (franchiseOnClock) {
								infoLine += `<input type="hidden" name="PLAYER_PICK" value="${p.id}">`;
							} else {
								infoLine += `<input type="hidden" name="PICKS" value="${p.id}"><div class="moveBtns"><button type="button" class="move-up-btn" title="Move Player Up 1 Spot">â†‘</button><button type="button" class="move-up-btn-twenty" title="Move Player Up 20 Spots">â†‘ 20</button><button type="button" class="move-down-btn" title="Move Player Down 1 Spot">â†“</button><button type="button" class="move-down-btn-twenty" title="Move Player Down 20 Spots">â†“ 20</button><button type="button" class="move-Up-down-btn-twenty" title="Move Player 20 Spots">â†‘ 20 â†“</button></div>`;
							}
						}
					} else {
						if (p.sal) {
							infoLine += `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine += `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
						}
					}

					let infoRank = ``
					if (sortMyRank) {
						infoRank = `${!isNaN(parseFloat(p.myrank)) ? p.myrank : "&mdash;"}`;
					} else {
						infoRank = `${!isNaN(parseFloat(p.fsrank)) ? p.fsrank : "&mdash;"}`;
					}

					const row = document.createElement("div");
					if (hasLock || hasAsterisk) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
					}

					if (type === "add" && franchiseOnClock && curRoster.length === 1) {
						row.classList.add("disabled-draftPick");
					}

					if (hasLock || hasAsterisk) {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="${sortMyRank ? "player-myrank" : "player-wproj"}" style="text-align:right; font-weight:900;">${infoRank}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="${sortMyRank ? "player-myrank" : "player-wproj"}" style="text-align:right; font-weight:900;">${infoRank}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Remove"}</button>`;
					}

					fragment.appendChild(row);
				});

				container.appendChild(fragment);

				if (type === "drop") {
					if (Array.isArray(curRoster) && curRoster.length < 7) {
						container.classList.add("showFilters");
					} else {
						container.classList.remove("showFilters");
					}
				}
			}


			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					// ðŸš« For "drop" rows, only trigger if clicking .select-btn
					if (type === "drop" && !franchiseOnClock && !e.target.classList.contains("select-btn")) return;

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}


			// Default to sorting Add list by WPROJ descending
			if (sortMyRank) {
				currentSortKeyAdd = "myrank";
			} else {
				currentSortKeyAdd = "fsrank";
			}
			sortDirectionAdd = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');

			// Update caret icon and activate class on WPROJ button
			let pwptsBtnAdd = '';

			if (sortMyRank) {
				pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="myrank"]');
			} else {
				pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="fsrank"]');
			}

			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-up");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});

			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					//if (!row.classList.contains("disabled-locked")) {
					handlePlayerRowClick(row, type);
					//}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});

			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							addRow.style.display = "";
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0 && !hadPlayers) {
						submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}

				if (franchiseOnClock && curRoster.length === 1) {
					document.querySelectorAll('#add-player-list .add-drop-player-row').forEach(div => {
						div.classList.add('disabled-draftPick');
					});
				} else {
					document.querySelectorAll('#add-player-list .add-drop-player-row').forEach(div => {
						div.classList.remove('disabled-draftPick');
					});
				}


			}

			document.getElementById("drop-player-list").addEventListener("click", function (e) {
				const btn = e.target;
				const row = btn.closest(".add-drop-player-row");
				if (!row) return;

				const parent = row.parentNode;
				const allRows = Array.from(parent.querySelectorAll(".add-drop-player-row"));
				const index = allRows.indexOf(row);

				const submitBtn = document.getElementById("add_drop_submit");

				if (btn.classList.contains("move-up-btn")) {
					const prev = row.previousElementSibling;
					if (prev && prev.classList.contains("add-drop-player-row")) {
						parent.insertBefore(row, prev);
						sortSyncCurRosterOrder();
					}
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-down-btn")) {
					const next = row.nextElementSibling;
					if (next && next.classList.contains("add-drop-player-row")) {
						parent.insertBefore(next, row);
						sortSyncCurRosterOrder();
					}
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-up-btn-twenty")) {
					let targetIndex = index - 20;
					if (targetIndex < 0) targetIndex = 0;
					const targetRow = allRows[targetIndex];
					parent.insertBefore(row, targetRow);
					sortSyncCurRosterOrder();
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-down-btn-twenty")) {
					let targetIndex = index + 20;
					if (targetIndex >= allRows.length) {
						parent.appendChild(row);
					} else {
						const targetRow = allRows[targetIndex];
						parent.insertBefore(row, targetRow.nextSibling);
					}
					sortSyncCurRosterOrder();
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

				if (btn.classList.contains("move-Up-down-btn-twenty")) {
					// Remove any existing prompt
					const existingPrompt = document.querySelector(".move-20-prompt");
					if (existingPrompt) existingPrompt.remove();

					// Create prompt container
					const promptDiv = document.createElement("div");
					promptDiv.className = "move-20-prompt oddtablerow";
					promptDiv.style.cssText = `padding:.25rem;display:flex;align-items:center;gap:.25rem;margin:.25rem 0`;

					promptDiv.innerHTML = `<strong style="white-space:nowrap;font-size:1rem;font-weight:40">Move Player:</strong><select id="move-20-select" style="width:100%!important;padding:0!important;height:2rem;"><option value="">Direction</option><option value="up">â†‘ Up 20</option><option value="down">â†“ Down 20</option></select><button style="padding:.1875rem;height:2rem;" type="button" id="confirm-move-20">Confirm</button><button type="button" id="cancel-move-20" style="padding:.1875rem;height:2rem;">Cancel</button>`;

					// Insert the prompt after the entire .add-drop-player-row
					row.insertAdjacentElement("afterend", promptDiv);

					// Confirm handler
					promptDiv.querySelector("#confirm-move-20").addEventListener("click", () => {
						const direction = promptDiv.querySelector("#move-20-select").value;
						promptDiv.remove();

						if (direction === "up") {
							let targetIndex = index - 20;
							if (targetIndex < 0) targetIndex = 0;
							const targetRow = allRows[targetIndex];
							parent.insertBefore(row, targetRow);
							sortSyncCurRosterOrder();
						} else if (direction === "down") {
							let targetIndex = index + 20;
							if (targetIndex >= allRows.length) {
								parent.appendChild(row);
							} else {
								const targetRow = allRows[targetIndex];
								parent.insertBefore(row, targetRow.nextSibling);
							}
							sortSyncCurRosterOrder();
						}
					});

					// Cancel handler
					promptDiv.querySelector("#cancel-move-20").addEventListener("click", () => {
						promptDiv.remove();
					});
					if (submitBtn) {
						submitBtn.disabled = false;
					}
				}

			});

			document.getElementById("helpMe")?.addEventListener("click", function () {
				const rows = document.querySelectorAll(".showHideRow, .showHideRowShow");
				const isShowing = this.textContent === "Close Help";

				rows.forEach(row => {
					if (isShowing) {
						row.classList.remove("showHideRowShow");
						row.classList.add("showHideRow");
					} else {
						row.classList.remove("showHideRow");
						row.classList.add("showHideRowShow");
					}
				});

				this.textContent = isShowing ? "Open Help" : "Close Help";
			});

		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// End Make Draft Pick
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// contest lineup
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (thisProgram === "contest_lineup") {
	const style = document.createElement("style");
	style.textContent = `#contest_lineup table,#contest_lineup .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.querySelectorAll('#contest_lineup table.report').forEach(table => {
			// Check if already wrapped
			if (table.parentElement?.classList.contains('mobile-wrap')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'mobile-wrap';

			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		});
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		const appendHTML = document.querySelector('form[action*="contest_lineup"]');

		let totalRequirement = null;
		let salaryCap = null;
		let tableOuterHTML = null;
		let useSalary = false;

		if (appendHTML) {
			const allTables = Array.from(appendHTML.querySelectorAll("table")).reverse();

			const leagueTable = allTables.find(table =>
				table.textContent.includes("League requirements:")
			);

			if (leagueTable) {
				// Modify the table
				leagueTable.classList.add("report");

				// Add caption
				const caption = document.createElement("caption");
				const span = document.createElement("span");
				span.textContent = "League Requirements";
				caption.appendChild(span);
				leagueTable.insertBefore(caption, leagueTable.firstChild);

				// Remove the row that contains "League requirements:"
				const targetRow = Array.from(leagueTable.querySelectorAll("tr")).find(row =>
					row.textContent.includes("League requirements:")
				);
				if (targetRow) {
					targetRow.remove();
				}

				// Convert <td> to <th> in the first row
				const firstRow = leagueTable.querySelector("tr");
				if (firstRow) {
					const cells = Array.from(firstRow.querySelectorAll("td"));
					cells.forEach(td => {
						const th = document.createElement("th");
						th.innerHTML = td.innerHTML;
						// Copy any attributes if needed
						for (const attr of td.attributes) {
							th.setAttribute(attr.name, attr.value);
						}
						td.replaceWith(th);
					});
				}

				// Apply alternating classes to rows after the first row
				const allRows = leagueTable.querySelectorAll("tr");
				allRows.forEach((row, index) => {
					if (index === 0) return; // skip the header row

					// Remove existing class if necessary
					row.classList.remove("oddtablerow", "eventablerow");

					// Add alternating class
					const className = index % 2 === 0 ? "eventablerow" : "oddtablerow";
					row.classList.add(className);
				});

				// Now get the updated HTML
				tableOuterHTML = leagueTable.outerHTML;

				// Extract values
				const rows = leagueTable.querySelectorAll("tr");
				rows.forEach(row => {
					const cells = row.querySelectorAll("td");
					if (cells.length >= 2) {
						const label = cells[0].textContent.trim();
						const value = cells[1].textContent.trim();

						if (label === "Total") {
							if (value.includes("-")) {
								const parts = value.split("-");
								totalRequirement = parseInt(parts[1], 10);
							} else {
								totalRequirement = parseInt(value, 10);
							}
						} else if (label === "Salary") {
							salaryCap = parseFloat(value.replace(/[^0-9.]/g, ""));
							useSalary = true;
						}
					}
				});
			}

		}

		//console.log("Total Requirement:", totalRequirement); // â†’ 12
		//console.log("Salary Cap:", salaryCap); // â†’ 10000

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		const addDropContainer = document.querySelector("#contest_lineup");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			let franchiseId = document.querySelector('input[name="FRANCHISE"]')?.value || "";
			if (!franchiseId) {
				franchiseId = franchise_id;
			}
			const franchiseKey = `fid_${franchiseId}`;
			const franchiseObj = franchiseDatabase[franchiseKey];
			const franchiseName = franchiseObj?.name || "Unknown Franchise";
			const curWeek = document.querySelector('input[name="WEEK"]')?.value || "";

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let currentSortKeyDrop = null;
			let sortDirectionAdd = 1;
			let sortDirectionDrop = 1;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``

			html += `<form id="AddDropForm" action="add_drop" method="POST">`;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Add Players To Lineup</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="pwpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (addHasSalary) {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `<div id="locked-msg" align="left" style="text-align:center">`;

			html += `<div><b style="display:inline-block;text-align:center;width:2.5rem;">Hint: </b> Can't find a player on this list?<br>That may be because that player was already started.</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-drop-tableCap"><caption><span>${franchiseName} Lineup</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="pwpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (dropHasSalary) {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Position <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			if (tableOuterHTML) html += `<div id="tableCounter" class="mobile-wrap">${tableOuterHTML}</div>`;

			html += `<div id="loadText" class="mobile-wrap">`;
			html += `<table align="center" class="report selected-moves">`;
			html += `<caption><span>Optional Message</span></caption>`;
			html += `<tbody>`;
			html += `<tr><th colspan="100">Send message to your league about your lineup.</th></tr>`;
			html += `<tr>`;
			html += `<td><textarea name="MESSAGE" id="MESSAGE" rows="5" cols="70"></textarea></td>`;
			html += `</tr></tbody></table></div>`;

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;

			if (curRoster.length === 0) {
				html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit Lineup" style="display:inline-block;margin:0!important;margin-right:.325rem!important" disabled>`;
			} else {
				html += `<input id="add_drop_submit" type="submit" name="SUBMIT" value="Submit Lineup" style="display:inline-block;margin:0!important;margin-right:.325rem!important">`;
			}

			if (Array.isArray(curRoster) && curRoster.length === 0) {
				html += `<input id="clearDropList" type="button" value="Clear Lineup" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
			} else {
				html += `<input id="clearDropList" type="button" value="Clear Lineup" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
			}


			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML && appendHTML.parentElement?.classList.contains("mobile-wrap")) {
				appendHTML.parentElement.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {


					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}

				}

				if (type === "drop") {
					filtered.sort((a, b) => {
						const aPos = a.pos?.toUpperCase?.() || "";
						const bPos = b.pos?.toUpperCase?.() || "";
						const aRank = sortPlayerPosOrder[aPos] || 99;
						const bRank = sortPlayerPosOrder[bPos] || 99;

						if (aRank !== bRank) return aRank - bRank;

						const [alast, afirst] = a.name.split(", ");
						const [blast, bfirst] = b.name.split(", ");
						const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
						const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
						return aname.localeCompare(bname);
					});

					if (currentSortKeyDrop) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
							let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

							if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
						});
					}


				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (type === "drop") {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}</small>`;
						}
					} else {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}</small>`;
						}
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
					}

					if (hasLock) {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.pwpts)) ? parseFloat(p.pwpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.pwpts)) ? parseFloat(p.pwpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					}

					fragment.appendChild(row);
				});

				container.appendChild(fragment);
			}

			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}

			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "pwpts";
			sortDirectionAdd = -1;
			currentSortKeyDrop = "pos";
			sortDirectionDrop = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');
			const sortBarDrop = document.querySelector('.sort-bar.drop-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="pwpts"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
			if (pwptsBtnDrop) {
				const icon = pwptsBtnDrop.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnDrop.classList.add("activated");
			}

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});

			// Sort listeners (only for Drop list)
			sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyDrop === key) {
						sortDirectionDrop *= -1;
					} else {
						currentSortKeyDrop = key;
						sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(curRoster, "drop-player-list", "drop");

					const dropPlayerList = document.querySelector('#drop-player-list');
					if (dropPlayerList) {
						dropPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});

			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});


			document.getElementById("add_drop_submit").addEventListener('click', function (e) {
				e.preventDefault(); // Prevent actual form submission

				const confirmDrop = confirm("Are you sure you want to submit this lineup?");
				if (!confirmDrop) return; // User canceled

				const message = encodeURIComponent(document.getElementById("MESSAGE")?.value || "");

				// Build drop_pid params from curRoster array
				const dropParams = curRoster
					.map(player => `STARTERS=${encodeURIComponent(player.id)}`)
					.join("&");
				const fullUrl = `${baseURLDynamic}/${year}/contest_lineup?LEAGUE_ID=${league_id}&FRANCHISE=${franchiseId}&WEEK=${curWeek}&${dropParams}&MESSAGE=${message}`;

				window.location.href = fullUrl;
			});


			function handlePlayerRowClick(row, type) {

				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							addRow.style.display = "";
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}

				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0) {
						submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}
				if (tableOuterHTML) updateRequirementTable()
			}

			function updateRequirementTable() {
				let alertMessages = [];

				let currentSalary = 0;

				if (useSalary) {
					currentSalary = update_mySalary("picker", "avail_salary", "drop-player-list", salaryCap, "d", "curr_salary", alertMessages);
				}

				const pos_count = {};
				for (const pos in total_pos) {
					pos_count[pos] = 0;
				}

				const rows = document.querySelectorAll("#drop-player-list .add-drop-player-row");

				rows.forEach(row => {
					const pid = row.getAttribute("data-player-id");
					const posEl = row.querySelector(".player-pos");
					if (!posEl) return;

					let pos = posEl.textContent.trim();

					// Map compound position if needed
					if (typeof map_pos[pos] !== "undefined") {
						pos = map_pos[pos];
					}

					pos_count[pos] = (pos_count[pos] || 0) + 1;
				});

				let total_cnt = 0;
				for (const pos in pos_count) {
					const curr_cnt_el = document.getElementById("curr_" + pos);
					if (curr_cnt_el) {
						curr_cnt_el.innerHTML = pos_count[pos];
					}

					const avail_cnt_el = document.getElementById("avail_" + pos);
					if (avail_cnt_el) {
						const remaining = (total_pos[pos] || 0) - pos_count[pos];
						avail_cnt_el.innerHTML = remaining;
					}

					if (pos_count[pos] > (total_pos[pos] || 0)) {
						alertMessages.push(
							`Too many players for ${pos}. Max allowed is ${total_pos[pos]}.`
						);
					}

					total_cnt += pos_count[pos];
				}

				const curr_total_el = document.getElementById("curr_total");
				if (curr_total_el) {
					curr_total_el.innerHTML = total_cnt;
				}

				const avail_total_el = document.getElementById("avail_total");
				if (avail_total_el) {
					avail_total_el.innerHTML = totalRequirement - total_cnt;
				}

				if (total_cnt > totalRequirement) {
					alertMessages.push(
						`Too many total players. Max allowed is ${totalRequirement}.`
					);
				}

				const table = document.querySelector("#tableCounter table tbody");
				if (table) {
					const oldWarnings = table.querySelectorAll("tr.validation-warning");
					oldWarnings.forEach(row => row.remove());

					// Append new warnings
					alertMessages.forEach(msg => {
						const warnRow = document.createElement("tr");
						warnRow.className = "validation-warning";

						const td = document.createElement("td");
						td.setAttribute("colspan", "10");
						td.style.color = "red";
						td.textContent = msg;

						warnRow.appendChild(td);
						table.appendChild(warnRow);
					});
					// Apply alternating classes to all visible rows (excluding hidden rows if any)
					const rows = Array.from(table.querySelectorAll("tr:not(.hidden)"));
					rows.forEach((row, index) => {
						row.classList.remove("oddtablerow", "eventablerow");
						const className = index % 2 === 0 ? "oddtablerow" : "eventablerow";
						row.classList.add(className);
					});
				}

			}

			function update_mySalary(picker_id, sal_cap_field, sel_players_id, sal_cap, format, curr_sal_field, alertMessages = []) {
				const pdb = playerDatabaseObj[picker_id];
				let salary = 0;

				const playerRows = document.querySelectorAll("#drop-player-list .add-drop-player-row");

				playerRows.forEach(row => {
					const pid = row.getAttribute("data-player-id");
					const playerObj = pdb.find(p => p.id === pid);
					if (playerObj) {
						const this_sal = Number(playerObj.sort_sal);
						salary += this_sal;
					}
				});

				let avail = sal_cap - salary;

				// Collect salary cap alert instead of popping alert immediately
				if (salary > sal_cap) {
					alertMessages.push(
						`Salary cap exceeded. Cap is $${sal_cap}, but total is $${salary}.`
					);
				}

				const sal_cap_el = document.getElementById(sal_cap_field);
				const curr_sal_el = curr_sal_field ? document.getElementById(curr_sal_field) : null;

				if (format === 'm') {
					sal_cap_el.innerHTML = "$" + (avail / 1_000_000).toFixed(0);
					if (curr_sal_el) curr_sal_el.innerHTML = "$" + (salary / 1_000_000).toFixed(0);
				} else if (format === 'f') {
					sal_cap_el.innerHTML = "$" + avail.toFixed(2);
					if (curr_sal_el) curr_sal_el.innerHTML = "$" + salary.toFixed(2);
				} else {
					sal_cap_el.innerHTML = "$" + avail.toFixed(0);
					if (curr_sal_el) curr_sal_el.innerHTML = "$" + salary.toFixed(0);
				}

				return salary; // in case you want to use it elsewhere
			}

			if (tableOuterHTML) updateRequirementTable();

		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end contest lineup
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


*/


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// Set 'em and Leave 'em 
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (thisProgram === "options_256") {

	const style = document.createElement("style");
	style.textContent = `#options_256 table,#options_256 .mobile-wrap,#dropInputDiv{visibility:visible;}`;
	if (typeof franchise_id === "undefined") {
		document.body.appendChild(style);
	} else if (typeof playerDatabaseObj === "undefined") {
		document.body.appendChild(style);
	} else {
		// RUN ADD - DROP SCRIPT
		document.body.classList.add("DropSelect"); // add this class to use for CSS to target only the add - drop form page

		const appendHTML = document.querySelector('form[action*="load_rosters"]');

		if (typeof timeFrame === "undefined") {
			var timeFrame = 300;
		}

		const addDropContainer = document.querySelector("#options_256");
		if (addDropContainer) {

			const addPlayers = window.playerDatabaseObj?.picker || [];

			const select = document.getElementById("destination_list");
			const options = select?.querySelectorAll("option");

			if (options) {
				playerDatabaseObj.roster = []; // create/reset 'roster' array

				options.forEach(option => {
					const id = option.value;
					const matchedPlayer = addPlayers.find(p => p.id === id);

					if (matchedPlayer) {
						// Use full player data from addPlayers
						playerDatabaseObj.roster.push({
							...matchedPlayer
						});
					} else {
						// Fallback: parse from option text
						const text = option.textContent.trim(); // e.g., "Allen, Josh BUF QB"
						const parts = text.split(" ");
						if (parts.length >= 3) {
							const pos = parts.pop(); // Last part is position
							const nfl_team = parts.pop(); // Second last part is NFL team
							const name = parts.join(" "); // Remaining parts = name

							playerDatabaseObj.roster.push({
								id,
								name,
								nfl_team,
								pos
							});
						}
					}
				});
			}

			curRoster = window.playerDatabaseObj?.roster || [];
			const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
			const dropHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);

			let franchiseId = document.querySelector('input[name="FRANCHISE_ID"]')?.value || "";
			if (!franchiseId) {
				franchiseId = franchise_id;
			}
			const franchiseKey = `fid_${franchiseId}`;
			const franchiseObj = franchiseDatabase[franchiseKey];
			const franchiseName = franchiseObj?.name || "Unknown Franchise";

			let selectedAdd = null;
			let selectedDrop = null;
			let currentSortKeyAdd = null;
			let currentSortKeyDrop = null;
			let sortDirectionAdd = 1;
			let sortDirectionDrop = 1;

			const sourceSelect = document.getElementById("picker_filt_pos");
			let optionsHTML = null;
			if (sourceSelect) {
				optionsHTML = Array.from(sourceSelect.options)
					.filter(opt => opt.value.toUpperCase() !== "ALL")
					.map(opt => {
						const upperVal = opt.value.toUpperCase();
						return `<option value="${upperVal}">${upperVal}</option>`;
					}).join("");
			}

			const nflFilterSelect = document.getElementById("picker_filt_nfl");

			if (nflFilterSelect) {
				nflFilterSelect.id = "add_filt_nfl";
				nflFilterSelect.removeAttribute("onchange");
			}

			let html = ``
			html += `<form id="AddDropForm" action="${baseURLDynamic}/${year}/load_rosters" method="post">`;
			html += `<input type="hidden" name="LEAGUE_ID" value="${league_id}">`;
			html += `<input type="hidden" name="FRANCHISE_ID" value="${franchiseId}">`;
			html += `<input type="hidden" name="OPTION" value="256"> `;

			html += `<div id="enhanced-add-drop-ui">`;

			html += `<div id="add-drop-enhanced-ui">`;

			if (optionsHTML || nflFilterSelect) {
				html += `<div class="filter-controls mobile-wrap">`;
				html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
				if (nflFilterSelect) html += nflFilterSelect.outerHTML;
				if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
				html += `</div>`;
			}

			html += `<div class="add-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-add-tableCap"><caption><span>Select Player To Load</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (addHasSalary) {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="adp">ADP <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;


			html += `<div id="add-player-list">`;
			// Add List Players are appended here
			html += `</div>`;

			html += `<div id="locked-msg" align="left" style="text-align:center">`;
			html += `<div><b style="display:inline-block;text-align:center;width:2.5rem;">Hint: </b> Can't find a player on this list?<br>You can <a href="player_search?L=${league_id}" target="_blank">search our player database</a> to try to find him.</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `<div class="drop-player-container mobile-wrap">`;

			html += `<table align="center" class="report cus-drop-tableCap"><caption><span>${franchiseName} Roster</span></caption><tbody><tr><th><div class="sort-bar drop-list"><span>Sort by:</span><button type="button" class="sort-btn drop-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
			if (dropHasSalary) {
				html += `<button type="button" class="sort-btn drop-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn drop-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
			} else {
				html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="adp">ADP <i class="fa-solid"></i></button>`;
			}
			html += `</div></th></tr></tbody></table>`;

			html += `<div id="drop-player-list"></div>`;
			// Drop List Players are appended here
			html += `</div>`;
			html += `</div>`;

			html += `</div>`;

			html += `</div>`;

			html += `<br>`;

			html += `<div id="dropInputDiv" style="text-align:center; margin-top: 1rem;">`;
			html += `<input id="add_drop_submit" type="submit" value="Load/Unload Roster" style="display:inline-block;margin:0!important;margin-right:.325rem!important">`;

			if (Array.isArray(curRoster) && curRoster.length === 0) {
				html += `<input id="clearDropList" type="button" value="Clear Roster" style="display:inline-block;margin:0!important;margin-left:.162rem!important" disabled>`;
			} else {
				html += `<input id="clearDropList" type="button" value="Clear Roster" style="display:inline-block;margin:0!important;margin-left:.162rem!important">`;
			}


			html += `</div>`;

			html += `<br>`;

			html += `</form>`;

			if (appendHTML) {
				appendHTML.outerHTML = html;
			}

			const searchInput = document.getElementById("addDropSearch");
			const positionFilter = document.getElementById("position-filter");

			// ADD FUNCTIONS

			function renderPlayerList(players, containerId, type) {
				const container = document.getElementById(containerId);
				if (!container) {
					console.warn(`â— Container ${containerId} not found.`);
					return;
				}
				container.textContent = ""; // Faster DOM clear

				let filtered = players;

				// Filter for "add"
				if (type === "add") {


					if (optionsHTML || nflFilterSelect) {
						const searchInput = document.getElementById("addDropSearch");
						const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

						const selectedPos = document.getElementById("position-filter")?.value || "";
						const selectedTeam = document.querySelector("#add_filt_nfl")?.value?.toUpperCase?.() || "";

						filtered = players.filter(p => {
							let [last, first] = p.name.split(", ");
							let fullName = `${first || ""} ${last || ""}`.trim();

							return (
								fullName.toLowerCase().includes(searchTerm) &&
								(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
								(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
							);
						});
					}

					// Sort after filtering, if a sort key is set
					if (currentSortKeyAdd) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
							let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

							if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
						});
					}

				}

				if (type === "drop") {
					filtered.sort((a, b) => {
						const aPos = a.pos?.toUpperCase?.() || "";
						const bPos = b.pos?.toUpperCase?.() || "";
						const aRank = sortPlayerPosOrder[aPos] || 99;
						const bRank = sortPlayerPosOrder[bPos] || 99;

						if (aRank !== bRank) return aRank - bRank;

						const [alast, afirst] = a.name.split(", ");
						const [blast, bfirst] = b.name.split(", ");
						const aname = `${afirst || ""} ${alast || ""}`.toLowerCase();
						const bname = `${bfirst || ""} ${blast || ""}`.toLowerCase();
						return aname.localeCompare(bname);
					});

					if (currentSortKeyDrop) {
						filtered.sort((a, b) => {
							let aVal = sortPlayerObjectData(a, currentSortKeyDrop);
							let bVal = sortPlayerObjectData(b, currentSortKeyDrop);

							if (currentSortKeyDrop === "fsrank" || currentSortKeyDrop === "pwpts" || currentSortKeyDrop === "projpts") {
								// If value is 0, push to bottom
								if (aVal === 0 && bVal !== 0) return 1;
								if (bVal === 0 && aVal !== 0) return -1;
								if (aVal === 0 && bVal === 0) return 0;
							}

							return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionDrop;
						});
					}


				}

				// Use document fragment for efficiency
				const fragment = document.createDocumentFragment();

				filtered.forEach((p, index) => {
					const [lastRaw, firstRaw] = p.name.split(", ");
					let first = firstRaw?.trim() || "";
					let last = lastRaw?.trim() || "";

					const hasHash = first.includes("#") || last.includes("#");
					const hasAsterisk = first.includes("*") || last.includes("*");
					const hasLock = first.includes("^") || last.includes("^");

					const isRookie = first.includes("(R)") || last.includes("(R)");

					first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
					const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

					let statusSpan = "";
					if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
					if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
					if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

					const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
					const imageUrl = isSpecial ?
						`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
						`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

					const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

					let infoLine = "";

					if (type === "drop") {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small><input type="hidden" name="ROSTER" value="${p.id}">`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small><input type="hidden" name="ROSTER" value="${p.id}">`;
						}
					} else {
						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.adp)) ? ` &bull; ADP: ${parseFloat(p.adp)}` : ' &bull; ADP: N/A'}</small>`;
						}
					}

					const row = document.createElement("div");
					if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
					row.dataset.playerId = p.id;

					if (type === "add" && curRoster.some(d => d.id === p.id)) {
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
					}

					if (hasLock) {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
					} else {
						row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
					}
					fragment.appendChild(row);
				});

				container.appendChild(fragment);
			}

			// AFTER addDropContainer.appendChild(newForm);
			const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

			if (enhancedUIContainer) {
				enhancedUIContainer.addEventListener("click", function (e) {
					const row = e.target.closest(".add-drop-player-row");
					if (!row || !enhancedUIContainer.contains(row)) return;

					const isAdd = !!row.closest("#add-player-list");
					const type = isAdd ? "add" : "drop";

					handlePlayerRowClick(row, type);
				});
			} else {
				console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
			}

			// Default to sorting Add list by WPROJ descending
			currentSortKeyAdd = "projpts";
			sortDirectionAdd = -1;
			currentSortKeyDrop = "pos";
			sortDirectionDrop = 1;
			renderPlayerList(addPlayers, "add-player-list", "add");
			renderPlayerList(curRoster, "drop-player-list", "drop");

			const sortBarAdd = document.querySelector('.sort-bar.add-list');
			const sortBarDrop = document.querySelector('.sort-bar.drop-list');

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="projpts"]');
			if (pwptsBtnAdd) {
				const icon = pwptsBtnAdd.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnAdd.classList.add("activated");
			}

			// Update caret icon and activate class on WPROJ button
			const pwptsBtnDrop = sortBarDrop.querySelector('button[data-key="pos"]');
			if (pwptsBtnDrop) {
				const icon = pwptsBtnDrop.querySelector("i");
				icon.classList.add("fa-caret-down");
				pwptsBtnDrop.classList.add("activated");
			}

			if (searchInput) {
				// Live filters (only for Add list)
				searchInput.addEventListener("input", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			if (positionFilter) {
				positionFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			const updatedNFLFilter = document.getElementById("add_filt_nfl");
			if (updatedNFLFilter) {
				updatedNFLFilter.addEventListener("change", () => {
					renderPlayerList(addPlayers, "add-player-list", "add");
					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			}

			sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
			sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.body.appendChild(style);
					}, timeFrame);
				});
			});

			// Sort listeners (only for Add list)
			sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyAdd === key) {
						sortDirectionAdd *= -1;
					} else {
						currentSortKeyAdd = key;
						sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(addPlayers, "add-player-list", "add");

					const addPlayerList = document.querySelector('#add-player-list');
					if (addPlayerList) {
						addPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});
			// Sort listeners (only for Drop list)
			sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(button => {
				button.addEventListener("click", () => {
					const key = button.dataset.key;

					// Update direction
					if (currentSortKeyDrop === key) {
						sortDirectionDrop *= -1;
					} else {
						currentSortKeyDrop = key;
						sortDirectionDrop = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
					}

					// Remove existing icons and active class
					sortBarDrop.querySelectorAll(".sort-btn.drop-list").forEach(btn => {
						btn.classList.remove("activated");
						const icon = btn.querySelector("i");
						icon.className = "fa-solid"; // reset
					});

					// Set the active button + caret
					button.classList.add("activated");
					const icon = button.querySelector("i");
					icon.classList.add(sortDirectionDrop === 1 ? "fa-caret-up" : "fa-caret-down");

					renderPlayerList(curRoster, "drop-player-list", "drop");
					const dropPlayerList = document.querySelector('#drop-player-list');
					if (dropPlayerList) {
						dropPlayerList.scrollTo({
							top: 0
						});
					}
				});
			});


			function clearAllFromList(listId, type) {
				const container = document.getElementById(listId);
				if (!container) return;

				const rows = container.querySelectorAll(".add-drop-player-row");
				rows.forEach(row => {
					if (!row.classList.contains("disabled-locked")) {
						handlePlayerRowClick(row, type);
					}
				});
			}

			document.getElementById("clearDropList")?.addEventListener("click", () => {
				clearAllFromList("drop-player-list", "drop");
			});


			document.getElementById("add_drop_submit").addEventListener('click', function (e) {
				e.preventDefault(); // Prevent default submit button behavior

				const confirmDrop = confirm("Are you sure you want to add these players to your roster?");
				if (!confirmDrop) return; // User canceled

				// Submit the form manually
				const form = document.getElementById("AddDropForm");
				if (form) {
					form.submit();
				}
			});

			function handlePlayerRowClick(row, type) {
				const playerId = row.dataset.playerId;
				if (!playerId) return;

				// Find player in addPlayers array by ID
				const player = addPlayers.find(p => p.id === playerId);
				if (!player) {
					console.warn("Player not found in addPlayers:", playerId);
					//return;
				}

				// Check if player already exists in curRoster (by ID)
				const alreadyAdded = curRoster.some(p => p.id === playerId);

				if (type === "drop") {
					if (alreadyAdded) {
						// Remove player from curRoster
						curRoster = curRoster.filter(p => p.id !== playerId);
						renderPlayerList(curRoster, "drop-player-list", "drop");

						// Re-enable the corresponding add row
						const addRow = document.querySelector(`#add-player-list .add-drop-player-row[data-player-id="${playerId}"]`);
						if (addRow) {
							addRow.classList.remove("disabled-dropbox");
							addRow.style.display = "";
							//console.log(`Removed .disable from add row for player ${playerId}`);
						}
					}
				}
				if (type === "add") {
					// For add rows, only add if not already in the array
					if (!alreadyAdded) {
						curRoster.push(player);
						row.classList.add("disabled-dropbox");
						row.style.display = "none";
						//console.log("Added player object to curRoster:", player);
						renderPlayerList(curRoster, "drop-player-list", "drop");
					} else {
						console.warn("This player is already in array:", playerId);
					}
				}

				const submitBtn = document.getElementById("add_drop_submit");
				if (submitBtn) {
					if (curRoster.length === 0) {
						//submitBtn.disabled = true;
					} else {
						submitBtn.disabled = false;
					}
				}

				const clearRoster = document.getElementById("clearDropList");
				if (clearRoster) {
					if (curRoster.length === 0) {
						clearRoster.disabled = true;
					} else {
						clearRoster.disabled = false;
					}
				}

				if (typeof showRequirementTable !== 'undefined' && showRequirementTable) {
					updatePositionCount();
				}

			}

			function updatePositionCount() {
				var playerCount = [];
				playerCount["Total"] = 0;
				for (var i = 0; i < validPositions.length; i++) playerCount[validPositions[i]] = 0;

				const dropRows = document.querySelectorAll('#drop-player-list .add-drop-player-row');
				playerCount["Total"] = dropRows.length;

				dropRows.forEach(row => {
					const posEl = row.querySelector('.player-pos');
					if (!posEl) return;

					const position = posEl.textContent.trim();
					if (!playerCount[position]) {
						playerCount[position] = 0;
					}
					playerCount[position]++;
				});

				// CREATE TABLE AND APPEND
				var tableHTML = "";
				tableHTML += "<table class='positionCount report'><caption><span>Roster Requirements</span></caption>";
				tableHTML += "<tr><th>Pos</th><th>Sum</th>";
				if (includeMinColumn) tableHTML += "<th>Min</th>";
				if (includeMaxColumn) tableHTML += "<th>Max</th>";
				tableHTML += "</tr>";

				var maxExceeded = false;
				var minExceeded = false;
				let rowIndex = 0;

				for (var key in playerCount) {
					if (playerCount.hasOwnProperty(key)) {
						let classes = [];

						// Alternate row classes
						classes.push(rowIndex % 2 === 0 ? "oddtablerow" : "eventablerow");

						// Conditional classes
						if (useMaximumTotals && playerCount[key] > maximumPositionTotals[key]) {
							classes.push("positionFailMax");
							maxExceeded = true;
						}
						if (useMinimumTotals && playerCount[key] < minimumPositionTotals[key]) {
							classes.push("positionFailMin");
							minExceeded = true;
						}

						const classAttr = classes.length ? ` class="${classes.join(' ')}"` : "";

						tableHTML += `<tr${classAttr}><td>${key}</td><td>${playerCount[key]}</td>`;
						if (includeMinColumn) tableHTML += `<td>${minimumPositionTotals[key]}</td>`;
						if (includeMaxColumn) tableHTML += `<td>${maximumPositionTotals[key]}</td>`;
						tableHTML += `</tr>`;

						rowIndex++;
					}
				}

				tableHTML += "</table>";
				if (maxExceeded) tableHTML += "<div class='positionFailMax'>Maximum Exceeded</div>";
				if (minExceeded) tableHTML += "<div class='positionFailMin'>Minimum Not Met</div>";

				document.querySelectorAll('.newColumn').forEach(el => el.remove());

				const enhancedUI = document.querySelector('#enhanced-add-drop-ui');
				if (enhancedUI) {
					const newDiv = document.createElement('div');
					newDiv.className = 'mobile-wrap newColumn';
					newDiv.innerHTML = tableHTML;
					enhancedUI.insertAdjacentElement('afterend', newDiv);
				}

				const failMin = document.querySelectorAll('div.positionFailMin').length;
				const failMax = document.querySelectorAll('div.positionFailMax').length;

				const submitBtn = document.getElementById('add_drop_submit');
				if (submitBtn) {
					submitBtn.disabled = failMin < 1 && failMax < 1 ? false : true;
				}
			}

			if (typeof showRequirementTable !== 'undefined' && showRequirementTable) {
				updatePositionCount();
			}

		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end Set 'em and Leave 'em 
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////








/*
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// auction bids
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (thisProgram === "options_43") {

	const style = document.createElement("style");

	style.textContent = `#options_43 table,#options_43 .mobile-wrap,#options_43 form{visibility:visible;}`;

	const addDropContainer = document.querySelector("#options_43");

	if (!addDropContainer) {
		document.body.appendChild(style);
		console.warn("#options_43 not found.");
	} else {
		const tables = addDropContainer.querySelectorAll("table.report");
		let financeTableHTML = null;
		let warningHTML = null;
		let captionSpan = null;
		let auctionForm = null;
		let commishTable = null;
		let mainTable = null;
		let openingBidInputHTML = null;
		let bidHintHTML = null;

		let franchiseId = document.querySelector('input[name="FRANCHISE_ID"]')?.value || "";
		if (!franchiseId) {
			franchiseId = franchise_id;
		}
		const franchiseKey = `fid_${franchiseId}`;
		const franchiseObj = franchiseDatabase[franchiseKey];
		const franchiseName = franchiseObj?.name || "Unknown Franchise";

		tables.forEach(table => {
			// Use try-catch only if you're dynamically loading unpredictable content (optional)
			try {
				const th = table.querySelector("th");
				const thText = th?.textContent?.trim();
				const captionSpanEl = table.querySelector("caption > span");
				const captionText = captionSpanEl?.textContent?.trim();

				if (thText?.includes("Financial Status")) {
					const parentTable = th.closest("table");
					if (parentTable) {
						parentTable.classList.add("report");

						// âœ… Create and prepend the caption
						const caption = document.createElement("caption");
						const span = document.createElement("span");
						span.textContent = `${franchiseName} Auction Status`;
						caption.appendChild(span);

						// Insert caption at the top (some tables already have one &mdash; optional logic if needed)
						const existingCaption = parentTable.querySelector("caption");
						if (existingCaption) {
							existingCaption.replaceWith(caption); // or remove it first if you want to avoid duplicates
						} else {
							parentTable.insertBefore(caption, parentTable.firstChild);
						}

						// âœ… Get updated table HTML
						financeTableHTML = parentTable.outerHTML;
					}
				}

				if (captionText?.includes("Commissioner Actions")) {
					const parentTable = captionSpanEl.closest("table");
					if (parentTable) {
						commishTable = parentTable.outerHTML;
						parentTable.remove();
					}
				}

				if (captionText?.includes("Start Auctioning")) {
					mainTable = captionSpanEl.closest("table");

					if (captionText?.includes("Start Auctioning")) {
						mainTable = captionSpanEl.closest("table");

						if (mainTable) {
							const form = mainTable.closest("form");
							const warning = mainTable.querySelector("td h3.warning");

							if (form) {
								form.id = "replaceForm";
								auctionForm = form;
							}

							if (warning) {
								warningHTML = warning.innerHTML.trim();
							}

							// âœ… Get the bid input field's outer HTML
							const openingBidInput = mainTable.querySelector('input[name="OPENING_BID"]');
							if (openingBidInput) {
								openingBidInputHTML = openingBidInput.outerHTML;
							}

							// âœ… Get the full reportnavigation span (hint text)
							const spans = mainTable.querySelectorAll('span');
							for (const span of spans) {
								if (span.textContent.toLowerCase().includes('starting bid')) {
									bidHintHTML = span.outerHTML;
									break;
								}
							}

							captionSpan = captionText;
						}
					}

				}
			} catch (err) {
				console.error("Error processing table:", err);
			}
		});

		if (warningHTML || auctionForm || financeTableHTML) {

			document.body.classList.add("addDropSelect");

			if (typeof timeFrame === "undefined") {
				var timeFrame = 300;
			}

			if (warningHTML && financeTableHTML && captionSpan && typeof playerDatabaseObj === "undefined") {

				let html = ``;

				html += `<div id="add-drop-summary" class="mobile-wrap">`;
				html += `<table align="center" class="report selected-moves">`;
				html += `<caption><span>${captionSpan}</span></caption>`;
				html += `<tbody>`;
				html += `<tr><th colspan="100">Select A Player Before Submitting Auction Bid</th></tr>`;
				html += `<tr><td>`;
				html += `<div class="warning" style="text-align:center;padding:.625rem;font-size:1rem;">${warningHTML}</div>`;
				html += `</td></tr></tbody></table></div>`; // close add-drop-summary and selected-moves table

				html += `<div id="enhanced-add-drop-ui">`;
				html += `<div class="drop-player-container mobile-wrap">`;
				html += `${financeTableHTML}`;
				html += `</div>`;
				html += `</div>`;

				if (commishTable) {
					html += `<div class="mobile-wrap commish-auction-table"><table align="center" cellspacing="1" class="report"><caption><span>Commissioner Actions</span></caption>`;
					html += `<tbody>`;
					html += `<tr class="oddtablerow"><td><a href="/${year}/options?L=${league_id}&O=127">Delete Auctions</a></td></tr>`;
					html += `<tr class="eventablerow"><td><a href="/${year}/csetup?L=${league_id}&C=AUCTIONS">Auction Setup</a></td></tr>`;
					html += `<tr class="oddtablerow"><td><a href="/${year}/auction_bid?L=54807&FRANCHISE_ID=${franchiseId}&OVER=1" onclick="return confirm('Are you sure you want to end this auction? It will delete all current auctions and discard any and all players auctioned so far.')">End The Entire Auction</a> Note: All current open auctions will be discarded and the players involved will be returned to the free agent pool and franchise owners will not be able to bid on players.</td></tr>`;
					html += `</tbody>`;
					html += `</table></div>`;
				}

				mainTable.outerHTML = html;
				mainTable.remove();

				document.querySelectorAll('#options_43 table.report').forEach(table => {
					// Check if already wrapped
					if (table.parentElement?.classList.contains('mobile-wrap')) return;
					const wrapper = document.createElement('div');
					wrapper.className = 'mobile-wrap';
					table.parentNode.insertBefore(wrapper, table);
					wrapper.appendChild(table);
				});

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setTimeout(() => {
							document.body.appendChild(style);
						}, timeFrame);
					});
				});

			} else if (financeTableHTML && captionSpan && typeof playerDatabaseObj !== "undefined") {


				const addPlayers = window.playerDatabaseObj?.picker || [];
				const addHasSalary = Object.values(addPlayers).some(p => p.sal !== undefined);
				const addPidInput = document.getElementById("add_pid_field_id");
				const addPidValue = addPidInput?.value?.trim() || null;


				let selectedAdd = null;
				let selectedDrop = null;
				let currentSortKeyAdd = null;
				let currentSortKeyDrop = null;
				let sortDirectionAdd = 1;
				let sortDirectionDrop = 1;

				// Step 1: Extract and deduplicate hidden inputs
				const seenNames = new Set();

				const sourceSelect = document.getElementById("picker_filt_pos");
				let optionsHTML = null;
				if (sourceSelect) {
					optionsHTML = Array.from(sourceSelect.options)
						.filter(opt => opt.value.toUpperCase() !== "ALL")
						.map(opt => {
							const upperVal = opt.value.toUpperCase();
							return `<option value="${upperVal}">${upperVal}</option>`;
						}).join("");
				}

				const nflFilterSelect = document.getElementById("picker_filt_nfl");

				if (nflFilterSelect) {
					nflFilterSelect.removeAttribute("onchange");
				}

				const addFieldName = document.getElementById("sel_name");
				const addBtn = document.querySelectorAll('input[value="Submit Bid"]');

				let html = ``
				html += `<form id="AddDropForm" action="auction_bid" method="post">`;
				html += `<input type="hidden" name="LEAGUE_ID" value="${league_id}">`;
				html += `<input type="hidden" name="FRANCHISE_ID" value="${franchiseId}">`;
				html += `<input type="hidden" name="PLAYER_PICK" id="sel_pid" value="">`;

				html += `<div id="enhanced-add-drop-ui">`;


				html += `<div id="add-drop-summary" class="mobile-wrap">`;
				html += `<table align="center" class="report selected-moves">`;
				html += `<caption><span>Start Auctioning A New Player For ${franchiseName}</span></caption>`;
				html += `<tbody>`;
				html += `<tr><th colspan="100">Select A Player Before Submitting Auction Bid</th></tr>`;
				html += `<tr><td>`;


				// add content if found for add - drop - submit button
				html += `<div class="wrapper-add-first">`;
				html += `<div class="row-add-drop-btn">`;
				html += `<div class="box-add-drop-btn adds-names shrink"><div class="adds-names" style="display:inline-block"><strong>Add:</strong></div><span id="add_name_field_id" style="padding-left:0.313rem">Player To Auction</span></div>`;
				html += `<div class="box-add-drop-btn grow addBtn desktop-add-btn" style="text-align:right"></div>`;
				html += `</div>`;
				html += `</div>`;

				if (openingBidInputHTML && bidHintHTML) {
					html += `<div class="row-add-drop-btn"><div class="box-add-drop-btn shrink"><div class="adds-names" style="display:inline-block"><strong>Opening bid:</strong></div>${openingBidInputHTML}</div>${bidHintHTML}</div>`;
				}

				// add submit button on mobiles
				html += `<div id="add-button-mobile" class="wrapper-add-first">`;
				html += `<div class="row-add-drop-btn">`;
				html += `<div class="box-add-drop-btn grow addBtn mobile-add-btn" style="text-align:center"></div>`;
				html += `</div>`;
				html += `</div>`;


				html += `</td></tr></tbody></table></div>`; // close add-drop-summary and selected-moves table


				html += `<div id="add-drop-enhanced-ui">`;

				if (optionsHTML || nflFilterSelect) {
					html += `<div class="filter-controls mobile-wrap">`;
					html += `<input id="addDropSearch" type="text" placeholder="Search player name..." style="flex: 1 1 0%; padding: .1875rem;">`;
					if (nflFilterSelect) html += nflFilterSelect.outerHTML;
					if (optionsHTML) html += `<select id="position-filter"><option value="">All</option>${optionsHTML}</select>`;
					html += `</div>`;
				}

				html += `<div class="add-player-container mobile-wrap">`;

				html += `<table align="center" class="report cus-add-tableCap"><caption><span>Available Players</span></caption><tbody><tr><th><div class="sort-bar add-list"><span>Sort by:</span><button type="button" class="sort-btn add-list" data-key="name">Name <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="projpts">Proj <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="nfl_team">Team <i class="fa-solid"></i></button>`;
				if (addHasSalary) {
					html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="player_salary">Sal <i class="fa-solid"></i></button>`;
				} else {
					html += `<button type="button" class="sort-btn add-list" data-key="pos">Pos <i class="fa-solid"></i></button><button type="button" class="sort-btn add-list" data-key="fsrank">Rank <i class="fa-solid"></i></button>`;
				}
				html += `</div></th></tr></tbody></table>`;

				html += `<div id="add-player-list">`;
				// Add List Players are appended here
				html += `</div>`;
				html += `<div id="locked-msg" align="left" style="text-align:left"><b style="display:inline-block;text-align:center;width:1.5rem;">[L]</b> Locked: Cant Cut List <a href="options?L=${league_id}&amp;O=199" target="blank">Can't Cut List</a><br><b style="display:inline-block;text-align:center;width:1.5rem;">#</b> Locked: Global Lock<b style="display:inline-block;text-align:center;width:1.5rem;">*</b> Locked: Recently Dropped</div>`;
				html += `</div>`;


				html += `<div class="drop-player-container mobile-wrap">`;
				html += `${financeTableHTML}`;
				html += `</div>`;

				html += `</div>`;

				html += `</div>`;

				html += `</div>`;

				html += `</form>`;


				if (commishTable) {
					html += `<div class="mobile-wrap commish-auction-table"><table align="center" cellspacing="1" class="report"><caption><span>Commissioner Actions</span></caption>`;
					html += `<tbody>`;
					html += `<tr class="oddtablerow"><td><a href="/${year}/options?L=${league_id}&O=127">Delete Auctions</a></td></tr>`;
					html += `<tr class="eventablerow"><td><a href="/${year}/csetup?L=${league_id}&C=AUCTIONS">Auction Setup</a></td></tr>`;
					html += `<tr class="oddtablerow"><td><a href="/${year}/auction_bid?L=54807&FRANCHISE_ID=${franchiseId}&OVER=1" onclick="return confirm('Are you sure you want to end this auction? It will delete all current auctions and discard any and all players auctioned so far.')">End The Entire Auction</a> Note: All current open auctions will be discarded and the players involved will be returned to the free agent pool and franchise owners will not be able to bid on players.</td></tr>`;
					html += `</tbody>`;
					html += `</table></div>`;
				}
				auctionForm.outerHTML = html;
				auctionForm.remove();

				if (addFieldName) addFieldName.remove();


				const searchInput = document.getElementById("addDropSearch");
				const positionFilter = document.getElementById("position-filter");


				// ADD FUNCTIONS

				function renderPlayerList(players, containerId, type) {
					const container = document.getElementById(containerId);
					if (!container) {
						console.warn(`â— Container ${containerId} not found.`);
						return;
					}
					container.textContent = ""; // Faster DOM clear

					let filtered = players;

					const addField = document.getElementById("add_pid_field_id") || {
						value: ""
					};

					const addFieldName = document.getElementById("add_name_field_id");

					// Filter for "add"
					if (type === "add") {

						if (optionsHTML || nflFilterSelect) {
							const searchInput = document.getElementById("addDropSearch");
							const searchTerm = searchInput?.value?.trim().toLowerCase() || "";

							const selectedPos = document.getElementById("position-filter")?.value || "";
							const selectedTeam = document.querySelector("#picker_filt_nfl")?.value?.toUpperCase?.() || "";

							filtered = players.filter(p => {
								let [last, first] = p.name.split(", ");
								let fullName = `${first || ""} ${last || ""}`.trim();

								return (
									fullName.toLowerCase().includes(searchTerm) &&
									(!selectedPos || p.pos?.toUpperCase() === selectedPos) &&
									(selectedTeam === "ALL" || !selectedTeam || p.nfl_team?.toUpperCase() === selectedTeam)
								);
							});
						}

						// Sort after filtering, if a sort key is set
						if (currentSortKeyAdd) {
							addField.value = "";
							if (addFieldName) addFieldName.innerHTML = "Select Player To Auction";
							filtered.sort((a, b) => {
								let aVal = sortPlayerObjectData(a, currentSortKeyAdd);
								let bVal = sortPlayerObjectData(b, currentSortKeyAdd);

								if (currentSortKeyAdd === "fsrank" || currentSortKeyAdd === "pwpts" || currentSortKeyAdd === "projpts") {
									// If value is 0, push to bottom
									if (aVal === 0 && bVal !== 0) return 1;
									if (bVal === 0 && aVal !== 0) return -1;
									if (aVal === 0 && bVal === 0) return 0;
								}

								return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortDirectionAdd;
							});
						}
					}

					// Use document fragment for efficiency
					const fragment = document.createDocumentFragment();

					filtered.forEach((p, index) => {
						const [lastRaw, firstRaw] = p.name.split(", ");
						let first = firstRaw?.trim() || "";
						let last = lastRaw?.trim() || "";

						const hasHash = first.includes("#") || last.includes("#");
						const hasAsterisk = first.includes("*") || last.includes("*");
						const hasLock = first.includes("^") || last.includes("^");

						const isRookie = first.includes("(R)") || last.includes("(R)");

						first = first.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
						last = last.replace("#", "").replace("*", "").replace("^", "").replace("(R)", "").trim();
						const fullName = `${first} ${last}${isRookie ? " (R)" : ""}`.trim();

						let statusSpan = "";
						if (hasHash) statusSpan += ` <span class="player-status">#</span>`;
						if (hasAsterisk) statusSpan += ` <span class="player-status">*</span>`;
						if (hasLock) statusSpan += ` <span class="player-status">[L]</span>`;

						const isSpecial = ["DEF", "COACH", "OFF", "TMQB", "TMRB", "TMWR", "TMTE", "TMPK", "TMPN", "TMDL", "TMLB", "TMDB"].includes(p.pos?.toUpperCase());
						const imageUrl = isSpecial ?
							`https://www.mflscripts.com/playerImages_96x96/mfl_${p.nfl_team}.svg` :
							`https://www.mflscripts.com/playerImages_80x107/mfl_${p.id}.png`;

						const fallbackImage = 'https://mflscripts.com/playerImages_80x107/free_agent.png';

						let infoLine = "";

						if (p.sal) {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.sort_sal)) ? ` &bull; Sal: $${parseFloat(p.sort_sal)}` : ' &bull; Sal: $0'}</small>`;
						} else {
							infoLine = `<small>${p.nfl_team ?? 'FA'}${p.bye_week ? ` &bull; Bye: ${p.bye_week}` : ' &bull; Bye: N/A'}${p.opp ? ` &bull; Opp: ${p.opp}` : ''}${!isNaN(parseFloat(p.fsrank)) ? ` &bull; Rank: ${parseFloat(p.fsrank)}` : ' &bull; Rank: N/A'}</small>`;
						}

						const row = document.createElement("div");
						if (hasLock) row.className = `add-drop-player-row disabled-locked ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
						else row.className = `add-drop-player-row ${index % 2 === 0 ? "oddtablerow" : "eventablerow"}`;
						row.dataset.playerId = p.id;

						if (hasLock) {
							row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Locked" : "Locked"}</button>`;
						} else {
							row.innerHTML = `<div class="player-pos ${p.pos?.toUpperCase() || ''}" style=" text-align:center; font-weight:bold;">${p.pos}</div>
  <div class="player-img-wrapper" style="flex-shrink:0;position:relative"><div class="player-img-wrapper-clippler"><img src="${imageUrl}" alt="${fullName}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>${p.inj ? `<div class="player-inj" style="position:absolute">${p.inj}</div>` : ""}</div>
  <div class="player-info"><strong>${fullName}${statusSpan}</strong><br>${infoLine} </div>
  <div class="player-wproj" style="text-align:right; font-weight:900;">${!isNaN(parseFloat(p.projpts)) ? parseFloat(p.projpts) : '&mdash;'}</div>
  <button type="button" class="select-btn">${type === "add" ? "Add" : "Drop"}</button>`;
						}

						fragment.appendChild(row);
					});

					container.appendChild(fragment);
				}


				// AFTER addDropContainer.appendChild(newForm);
				const enhancedUIContainer = document.getElementById("add-drop-enhanced-ui");

				if (enhancedUIContainer) {
					enhancedUIContainer.addEventListener("click", function (e) {
						const row = e.target.closest(".add-drop-player-row");
						if (!row || !enhancedUIContainer.contains(row)) return;

						const isAdd = !!row.closest("#add-player-list");
						const type = isAdd ? "add" : "drop";

						handlePlayerRowClick(row, type);
					});
				} else {
					console.warn("â— Could not find #add-drop-enhanced-ui for delegation.");
				}

				// Default to sorting Add list by WPROJ descending
				currentSortKeyAdd = "projpts";
				sortDirectionAdd = -1;
				currentSortKeyDrop = "pos";
				sortDirectionDrop = 1;
				renderPlayerList(addPlayers, "add-player-list", "add");

				const sortBarAdd = document.querySelector('.sort-bar.add-list');

				// Update caret icon and activate class on WPROJ button
				const pwptsBtnAdd = sortBarAdd.querySelector('button[data-key="projpts"]');
				if (pwptsBtnAdd) {
					const icon = pwptsBtnAdd.querySelector("i");
					icon.classList.add("fa-caret-down");
					pwptsBtnAdd.classList.add("activated");
				}

				if (searchInput) {
					// Live filters (only for Add list)
					searchInput.addEventListener("input", () => {
						renderPlayerList(addPlayers, "add-player-list", "add");
						const addPlayerList = document.querySelector('#add-player-list');
						if (addPlayerList) {
							addPlayerList.scrollTo({
								top: 0
							});
						}
					});
				}

				if (positionFilter) {
					positionFilter.addEventListener("change", () => {
						renderPlayerList(addPlayers, "add-player-list", "add");
						const addPlayerList = document.querySelector('#add-player-list');
						if (addPlayerList) {
							addPlayerList.scrollTo({
								top: 0
							});
						}
					});
				}

				const updatedNFLFilter = document.getElementById("picker_filt_nfl");
				if (updatedNFLFilter) {
					updatedNFLFilter.addEventListener("change", () => {
						renderPlayerList(addPlayers, "add-player-list", "add");
						const addPlayerList = document.querySelector('#add-player-list');
						if (addPlayerList) {
							addPlayerList.scrollTo({
								top: 0
							});
						}
					});
				}

				if (addPidValue) {
					const matchingRow = document.querySelector(`.add-drop-player-row[data-player-id="${addPidValue}"]`);
					if (matchingRow) {
						matchingRow.click();
					}
				}

				sortScrollFadeShadow("add-player-list", ".sort-bar.add-list");
				sortScrollFadeShadow("drop-player-list", ".sort-bar.drop-list");

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setTimeout(() => {
							document.body.appendChild(style);
						}, timeFrame);
					});
				});

				document.querySelectorAll('#options_43 table.report').forEach(table => {
					// Check if already wrapped
					if (table.parentElement?.classList.contains('mobile-wrap')) return;
					const wrapper = document.createElement('div');
					wrapper.className = 'mobile-wrap';
					table.parentNode.insertBefore(wrapper, table);
					wrapper.appendChild(table);
				});

				// Sort listeners (only for Add list)
				sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(button => {
					button.addEventListener("click", () => {
						const key = button.dataset.key;

						// Update direction
						if (currentSortKeyAdd === key) {
							sortDirectionAdd *= -1;
						} else {
							currentSortKeyAdd = key;
							sortDirectionAdd = (key === "pwpts" || key === "player_salary" || key === "projpts") ? -1 : 1;
						}

						// Remove existing icons and active class
						sortBarAdd.querySelectorAll(".sort-btn.add-list").forEach(btn => {
							btn.classList.remove("activated");
							const icon = btn.querySelector("i");
							icon.className = "fa-solid"; // reset
						});

						// Set the active button + caret
						button.classList.add("activated");
						const icon = button.querySelector("i");
						icon.classList.add(sortDirectionAdd === 1 ? "fa-caret-up" : "fa-caret-down");

						renderPlayerList(addPlayers, "add-player-list", "add");

						const addPlayerList = document.querySelector('#add-player-list');
						if (addPlayerList) {
							addPlayerList.scrollTo({
								top: 0
							});
						}
					});
				});

				function handlePlayerRowClick(row, type) {
					const playerId = row.dataset.playerId;
					const button = row.querySelector("button");
					const isAdd = type === "add";

					const addField = document.getElementById("sel_pid");

					const selected = isAdd ? selectedAdd : selectedDrop;
					const setSelected = isAdd ? (val) => (selectedAdd = val) : (val) => (selectedDrop = val);
					const field = addField;
					const summaryEl = document.getElementById(isAdd ? "add_name_field_id" : "drop_name_field_id");

					if (selected === row) {
						row.classList.remove("selected-player");
						setSelected(null);
						field.value = "";
						button.textContent = isAdd ? "Add" : "Drop";
						button.classList.remove("deselect-btn");
						button.classList.add("select-btn");
						summaryEl.textContent = "Select Player To Auction";
					} else {
						if (selected) {
							selected.classList.remove("selected-player");
							const prevBtn = selected.querySelector("button");
							if (prevBtn) {
								prevBtn.textContent = isAdd ? "Add" : "Drop";
								prevBtn.classList.remove("deselect-btn");
								prevBtn.classList.add("select-btn");
							}
						}
						row.classList.add("selected-player");
						setSelected(row);
						field.value = playerId;
						button.textContent = "Deselect";
						button.classList.remove("select-btn");
						button.classList.add("deselect-btn");

						const strongEl = row.querySelector(".player-info strong");
						let nameText = "";

						if (strongEl) {
							const cloned = strongEl.cloneNode(true); // avoid mutating original DOM
							const statusSpan = cloned.querySelector(".player-status");
							if (statusSpan) statusSpan.remove(); // remove span

							nameText = cloned.textContent.replace(/\(R\)/g, "").trim(); // remove (R) and trim
						}
						const pos = row.querySelector(".player-pos")?.textContent || "";
						const team = row.querySelector(".player-info small")?.textContent?.split("&bull;")[0]?.trim() || "";
						summaryEl.textContent = `${pos} ${nameText} (${team})`;
					}

					const submitBtn = document.getElementById("add_drop_submit");
					if (submitBtn) {
						const addHasValue = !!addField?.value;

						if (!addHasValue) {
							submitBtn.disabled = true;
						} else {
							submitBtn.disabled = false;
						}
					}

				}

				function handleSubmitButtonChange() {
					const width = window.innerWidth;

					const addField = document.getElementById("add_pid_field_id");

					const addHasValue = !!addField?.value?.trim();
					const shouldDisable = !(addHasValue); // true if neither field has a value

					const submitText = "Submit Bid";

					const attachSubmitHandler = (button) => {
						button.addEventListener("click", function (e) {
							const auctionBidInput = document.querySelector('input[name="OPENING_BID"]');

							if (auctionBidInput) {
								if (auctionBidInput.value.trim() === "") {
									e.preventDefault();
									alert("ðŸš« Please enter a Amount for your auction.");
								}
							}
						});
					};

					if (width < 700) {
						// Remove desktop version
						const desktopBtn = document.querySelector(".desktop-add-btn #add_drop_submit");
						if (desktopBtn) {
							desktopBtn.remove();
						}

						// Add to mobile container
						const mobileBtnContainer = document.querySelector(".mobile-add-btn");
						if (mobileBtnContainer && !mobileBtnContainer.querySelector("#add_drop_submit")) {
							const newBtn = document.createElement("input");
							newBtn.type = "submit";
							newBtn.id = "add_drop_submit";
							newBtn.name = "SUBMIT";
							newBtn.disabled = shouldDisable;
							newBtn.value = submitText;
							attachSubmitHandler(newBtn); // attach validation handler
							mobileBtnContainer.appendChild(newBtn);
						}

					} else {
						// Remove mobile version
						const mobileBtn = document.querySelector(".mobile-add-btn #add_drop_submit");
						if (mobileBtn) {
							mobileBtn.remove();
						}

						// Add to desktop container
						const desktopBtnContainer = document.querySelector(".desktop-add-btn");
						if (desktopBtnContainer && !desktopBtnContainer.querySelector("#add_drop_submit")) {
							const newBtn = document.createElement("input");
							newBtn.type = "submit";
							newBtn.id = "add_drop_submit";
							newBtn.name = "SUBMIT";
							newBtn.disabled = shouldDisable;
							newBtn.value = submitText;
							attachSubmitHandler(newBtn); // attach validation handler
							desktopBtnContainer.appendChild(newBtn);
						}
					}
				}

				handleSubmitButtonChange();
				window.addEventListener("resize", handleSubmitButtonChange);

			} else {
				document.body.appendChild(style);
			}

		} else {
			document.body.appendChild(style);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// end auction bids
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

*/
});
}
