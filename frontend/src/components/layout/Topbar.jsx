import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { attachAdminNavigationHandlers } from "../../utils/adminNavigation";
import { useAuth } from "../../context/AuthContext";

const topbarHtml = `<!-- Header -->
<div class="header">
	<div class="main-header">

		<div class="header-left">
			<a href="dashboard.php" class="logo">
				<img src="assets/img/logo.svg" alt="Logo">
			</a>
			<a href="dashboard.php" class="dark-logo">
				<img src="assets/img/logo-white.svg" alt="Logo">
			</a>
		</div>

		<a id="mobile_btn" class="mobile_btn" href="#sidebar">
			<span class="bar-icon">
				<span></span>
				<span></span>
				<span></span>
			</span>
		</a>

		<div class="header-user">
			<div class="nav user-menu nav-list">

				<div class="me-auto d-flex align-items-center" id="header-search">
					<a id="toggle_btn" href="javascript:void(0);" class="btn btn-menubar me-1">
						<i class="ti ti-arrow-bar-to-left"></i>
					</a>
					<!-- Search -->
					<div class="input-group input-group-flat d-inline-flex me-1">
						<span class="input-icon-addon">
							<i class="ti ti-search"></i>
						</span>
						<input type="text" class="form-control" placeholder="Search in HRMS">
						<span class="input-group-text">
							<kbd>CTRL + / </kbd>
						</span>
					</div>
					<!-- /Search -->
					<div class="dropdown crm-dropdown">
						<a href="#" class="btn btn-menubar me-1" data-bs-toggle="dropdown">
							<i class="ti ti-layout-grid"></i>
						</a>
						<div class="dropdown-menu dropdown-lg dropdown-menu-start">
							<div class="card mb-0 border-0 shadow-none">
								<div class="card-header">
									<h4>CRM</h4>
								</div>
								<div class="card-body pb-1">
									<div class="row">
										<div class="col-sm-6">
											<a href="contacts.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-user-shield text-default me-2"></i>Contacts
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="deals-grid.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-heart-handshake text-default me-2"></i>Deals
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="pipeline.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-timeline-event-text text-default me-2"></i>Pipeline
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
										</div>
										<div class="col-sm-6">
											<a href="companies-grid.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-building text-default me-2"></i>Companies
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="leads-grid.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-user-check text-default me-2"></i>Leads
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="activity.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-activity text-default me-2"></i>Activities
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<a href="profile-settings.php" class="btn btn-menubar">
						<i class="ti ti-settings-cog"></i>
					</a>
				</div>

				<!-- Horizontal Single -->
				<div class="sidebar sidebar-horizontal" id="horizontal-single">
					<div class="sidebar-menu">
						<div class="main-menu">
							<ul class="nav-menu">
								<li class="menu-title">
									<span>Main</span>
								</li>
								<li class="submenu">
									<a href="#" class="active">
										<i class="ti ti-smart-home"></i><span>Dashboard</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li><a href="dashboard.php" class="active">Admin Dashboard</a></li>
										<li><a href="employee-dashboard.php">Employee Dashboard</a></li>
										<li><a href="deals-dashboard.php">Deals Dashboard</a></li>
										<li><a href="leads-dashboard.php">Leads Dashboard</a></li>
									</ul>
								</li>
								<li class="submenu">
									<a href="#">
										<i class="ti ti-user-star"></i><span>Super Admin</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li><a href="dashboard.php">Dashboard</a></li>
										<li><a href="companies.php">Companies</a></li>
										<li><a href="subscription.php">Subscriptions</a></li>
										<li><a href="packages.php">Packages</a></li>
										<li><a href="domain.php">Domain</a></li>
										<li><a href="purchase-transaction.php">Purchase Transaction</a></li>
									</ul>
								</li>
								<li class="submenu">
									<a href="#">
										<i class="ti ti-layout-grid-add"></i><span>Applications</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li><a href="chat.php">Chat</a></li>
										<li class="submenu submenu-two">
											<a href="call.php">Calls<span
													class="menu-arrow inside-submenu"></span></a>
											<ul>
												<li><a href="voice-call.php">Voice Call</a></li>
												<li><a href="video-call.php">Video Call</a></li>
												<li><a href="outgoing-call.php">Outgoing Call</a></li>
												<li><a href="incoming-call.php">Incoming Call</a></li>
												<li><a href="call-history.php">Call History</a></li>
											</ul>
										</li>
										<li><a href="calendar.php">Calendar</a></li>
										<li><a href="email.php">Email</a></li>
										<li><a href="todo.php">To Do</a></li>
										<li><a href="notes.php">Notes</a></li>
										<li><a href="file-manager.php">File Manager</a></li>
										<li><a href="kanban-view.php">Kanban</a></li>
										<li><a href="invoices.php">Invoices</a></li>
									</ul>
								</li>
								<li class="submenu">
									<a href="#">
										<i class="ti ti-layout-board-split"></i><span>Layouts</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="layout-horizontal.php">
												<span>Horizontal</span>
											</a>
										</li>
										<li>
											<a href="layout-detached.php">
												<span>Detached</span>
											</a>
										</li>
										<li>
											<a href="layout-modern.php">
												<span>Modern</span>
											</a>
										</li>
										<li>
											<a href="layout-two-column.php">
												<span>Two Column </span>
											</a>
										</li>
										<li>
											<a href="layout-hovered.php">
												<span>Hovered</span>
											</a>
										</li>
										<li>
											<a href="layout-box.php">
												<span>Boxed</span>
											</a>
										</li>
										<li>
											<a href="layout-horizontal-single.php">
												<span>Horizontal Single</span>
											</a>
										</li>
										<li>
											<a href="layout-horizontal-overlay.php">
												<span>Horizontal Overlay</span>
											</a>
										</li>
										<li>
											<a href="layout-horizontal-box.php">
												<span>Horizontal Box</span>
											</a>
										</li>
										<li>
											<a href="layout-horizontal-sidemenu.php">
												<span>Menu Aside</span>
											</a>
										</li>
										<li>
											<a href="layout-vertical-transparent.php">
												<span>Transparent</span>
											</a>
										</li>
										<li>
											<a href="layout-without-header.php">
												<span>Without Header</span>
											</a>
										</li>
										<li>
											<a href="layout-rtl.php">
												<span>RTL</span>
											</a>
										</li>
										<li>
											<a href="layout-dark.php">
												<span>Dark</span>
											</a>
										</li>
									</ul>
								</li>
								<li class="submenu">
									<a href="#">
										<i class="ti ti-user-star"></i><span>Projects</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="clients-grid.php"><span>Clients</span>
											</a>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Projects</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="projects-grid.php">Projects</a></li>
												<li><a href="tasks.php">Tasks</a></li>
												<li><a href="task-board.php">Task Board</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="call.php">Crm<span class="menu-arrow"></span></a>
											<ul>
												<li><a href="contacts-grid.php"><span>Contacts</span></a></li>
												<li><a href="companies-grid.php"><span>Companies</span></a></li>
												<li><a href="deals-grid.php"><span>Deals</span></a></li>
												<li><a href="leads-grid.php"><span>Leads</span></a></li>
												<li><a href="pipeline.php"><span>Pipeline</span></a></li>
												<li><a href="analytics.php"><span>Analytics</span></a></li>
												<li><a href="activity.php"><span>Activities</span></a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Employees</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="employees.php">Employee Lists</a></li>
												<li><a href="employees-grid.php">Employee Grid</a></li>
												<li><a href="employee-details.php">Employee Details</a></li>
												<li><a href="departments.php">Departments</a></li>
												<li><a href="designations.php">Designations</a></li>
												<li><a href="policy.php">Policies</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Tickets</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="tickets.php">Tickets</a></li>
												<li><a href="ticket-details.php">Ticket Details</a></li>
											</ul>
										</li>
										<li><a href="holidays.php"><span>Holidays</span></a></li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Attendance</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li class="submenu">
													<a href="javascript:void(0);">Leaves<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="leaves.php">Leaves (Admin)</a></li>
														<li><a href="leaves-employee.php">Leave (Employee)</a></li>
													</ul>
												</li>
												<li><a href="attendance-admin.php">Attendance (Admin)</a></li>
												<li><a href="attendance-employee.php">Attendance (Employee)</a></li>
												<li><a href="timesheets.php">Timesheets</a></li>
												<li><a href="schedule-timing.php">Shift & Schedule</a></li>
												<li><a href="overtime.php">Overtime</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Performance</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="performance-indicator.php">Performance Indicator</a></li>
												<li><a href="performance-appraisal.php">Performance Appraisal</a></li>
												<li><a href="goal-tracking.php">Goal List</a></li>
												<li><a href="goal-type.php">Goal Type</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Training</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="training.php">Training List</a></li>
												<li><a href="trainers.php">Trainers</a></li>
												<li><a href="training-type.php">Training Type</a></li>
											</ul>
										</li>
										<li><a href="promotion.php"><span>Promotion</span></a></li>
										<li><a href="resignation.php"><span>Resignation</span></a></li>
										<li><a href="termination.php"><span>Termination</span></a></li>
									</ul>
								</li>
								<li class="submenu">
									<a href="#">
										<i class="ti ti-user-star"></i><span>Administration</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Sales</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="estimates.php">Estimates</a></li>
												<li><a href="invoices.php">Invoices</a></li>
												<li><a href="payments.php">Payments</a></li>
												<li><a href="expenses.php">Expenses</a></li>
												<li><a href="provident-fund.php">Provident Fund</a></li>
												<li><a href="taxes.php">Taxes</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Accounting</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="categories.php">Categories</a></li>
												<li><a href="budgets.php">Budgets</a></li>
												<li><a href="budget-expenses.php">Budget Expenses</a></li>
												<li><a href="budget-revenues.php">Budget Revenues</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Payroll</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="employee-salary.php">Employee Salary</a></li>
												<li><a href="payslip.php">Payslip</a></li>
												<li><a href="payroll.php">Payroll Items</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Assets</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="assets/dashboard.php">Assets</a></li>
												<li><a href="asset-categories.php">Asset Categories</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Help & Supports</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="knowledgebase.php">Knowledge Base</a></li>
												<li><a href="activity.php">Activities</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>User Management</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="users.php">Users</a></li>
												<li><a href="roles-permissions.php">Roles & Permissions</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Reports</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li><a href="expenses-report.php">Expense Report</a></li>
												<li><a href="invoice-report.php">Invoice Report</a></li>
												<li><a href="payment-report.php">Payment Report</a></li>
												<li><a href="project-report.php">Project Report</a></li>
												<li><a href="task-report.php">Task Report</a></li>
												<li><a href="user-report.php">User Report</a></li>
												<li><a href="employee-report.php">Employee Report</a></li>
												<li><a href="payslip-report.php">Payslip Report</a></li>
												<li><a href="attendance-report.php">Attendance Report</a></li>
												<li><a href="leave-report.php">Leave Report</a></li>
												<li><a href="daily-report.php">Daily Report</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Settings</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li class="submenu">
													<a href="javascript:void(0);">General Settings<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="profile-settings.php">Profile</a></li>
														<li><a href="security-settings.php">Security</a></li>
														<li><a href="notification-settings.php">Notifications</a></li>
														<li><a href="connected-apps.php">Connected Apps</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">Website Settings<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="bussiness-settings.php">Business Settings</a></li>
														<li><a href="seo-settings.php">SEO Settings</a></li>
														<li><a href="localization-settings.php">Localization</a></li>
														<li><a href="prefixes.php">Prefixes</a></li>
														<li><a href="preferences.php">Preferences</a></li>
														<li><a href="performance-appraisal.php">Appearance</a></li>
														<li><a href="language.php">Language</a></li>
														<li><a href="authentication-settings.php">Authentication</a></li>
														<li><a href="ai-settings.php">AI Settings</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">App Settings<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="salary-settings.php">Salary Settings</a></li>
														<li><a href="approval-settings.php">Approval Settings</a></li>
														<li><a href="invoice-settings.php">Invoice Settings</a></li>
														<li><a href="custom-fields.php">Custom Fields</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">System Settings<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="email-settings.php">Email Settings</a></li>
														<li><a href="email-template.php">Email Templates</a></li>
														<li><a href="sms-settings.php">SMS Settings</a></li>
														<li><a href="sms-template.php">SMS Templates</a></li>
														<li><a href="otp-settings.php">OTP</a></li>
														<li><a href="gdpr.php">GDPR Cookies</a></li>
														<li><a href="maintenance-mode.php">Maintenance Mode</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">Financial Settings<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="payment-gateways.php">Payment Gateways</a></li>
														<li><a href="tax-rates.php">Tax Rate</a></li>
														<li><a href="currencies.php">Currencies</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">Other Settings<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="custom-css.php">Custom CSS</a></li>
														<li><a href="custom-js.php">Custom JS</a></li>
														<li><a href="cronjob.php">Cronjob</a></li>
														<li><a href="storage-settings.php">Storage</a></li>
														<li><a href="ban-ip-address.php">Ban IP Address</a></li>
														<li><a href="backup.php">Backup</a></li>
														<li><a href="clear-cache.php">Clear Cache</a></li>
													</ul>
												</li>
											</ul>
										</li>
									</ul>
								</li>
								<li class="submenu">
									<a href="#">
										<i class="ti ti-page-break"></i><span>Pages</span>
										<span class="menu-arrow"></span>
									</a>
									<ul>
										<li><a href="starter.php"><span>Starter</span></a></li>
										<li><a href="profile.php"><span>Profile</span></a></li>
										<li><a href="gallery.php"><span>Gallery</span></a></li>
										<li><a href="search-result.php"><span>Search Results</span></a></li>
										<li><a href="timeline.php"><span>Timeline</span></a></li>
										<li><a href="pricing.php"><span>Pricing</span></a></li>
										<li><a href="coming-soon.php"><span>Coming Soon</span></a></li>
										<li><a href="under-maintenance.php"><span>Under Maintenance</span></a></li>
										<li><a href="under-construction.php"><span>Under Construction</span></a></li>
										<li><a href="api-keys.php"><span>API Keys</span></a></li>
										<li><a href="privacy-policy.php"><span>Privacy Policy</span></a></li>
										<li><a href="terms-condition.php"><span>Terms & Conditions</span></a></li>
										<li class="submenu">
											<a href="#"><span>Content</span> <span class="menu-arrow"></span></a>
											<ul>
												<li><a href="pages.php">Pages</a></li>
												<li class="submenu">
													<a href="javascript:void(0);">Blogs<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="blogs.php">All Blogs</a></li>
														<li><a href="blog-categories.php">Categories</a></li>
														<li><a href="blog-comments.php">Comments</a></li>
														<li><a href="blog-tags.php">Tags</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">Locations<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="countries.php">Countries</a></li>
														<li><a href="states.php">States</a></li>
														<li><a href="cities.php">Cities</a></li>
													</ul>
												</li>
												<li><a href="testimonials.php">Testimonials</a></li>
												<li><a href="faq.php">FAQ’S</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="#">
												<span>Authentication</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li class="submenu">
													<a href="javascript:void(0);" class="">Login<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="login.php">Cover</a></li>
														<li><a href="login-2.php">Illustration</a></li>
														<li><a href="login-3.php">Basic</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);" class="">Register<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="register.php">Cover</a></li>
														<li><a href="register-2.php">Illustration</a></li>
														<li><a href="register-3.php">Basic</a></li>
													</ul>
												</li>
												<li class="submenu"><a href="javascript:void(0);">Forgot Password<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="forgot-password.php">Cover</a></li>
														<li><a href="forgot-password-2.php">Illustration</a></li>
														<li><a href="forgot-password-3.php">Basic</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">Reset Password<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="reset-password.php">Cover</a></li>
														<li><a href="reset-password-2.php">Illustration</a></li>
														<li><a href="reset-password-3.php">Basic</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">Email Verification<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="email-verification.php">Cover</a></li>
														<li><a href="email-verification-2.php">Illustration</a></li>
														<li><a href="email-verification-3.php">Basic</a></li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">2 Step Verification<span class="menu-arrow"></span></a>
													<ul>
														<li><a href="two-step-verification.php">Cover</a></li>
														<li><a href="two-step-verification-2.php">Illustration</a></li>
														<li><a href="two-step-verification-3.php">Basic</a></li>
													</ul>
												</li>
												<li><a href="lock-screen.php">Lock Screen</a></li>
												<li><a href="error-404.php">404 Error</a></li>
												<li><a href="error-500.php">500 Error</a></li>
											</ul>
										</li>
										<li class="submenu">
											<a href="#">
												<span>UI Interface</span>
												<span class="menu-arrow"></span>
											</a>
											<ul>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-hierarchy-2"></i>
														<span>Base UI</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li>
															<a href="ui-alerts.php">Alerts</a>
														</li>
														<li>
															<a href="ui-accordion.php">Accordion</a>
														</li>
														<li>
															<a href="ui-avatar.php">Avatar</a>
														</li>
														<li>
															<a href="ui-badges.php">Badges</a>
														</li>
														<li>
															<a href="ui-borders.php">Border</a>
														</li>
														<li>
															<a href="ui-buttons.php">Buttons</a>
														</li>
														<li>
															<a href="ui-buttons-group.php">Button Group</a>
														</li>
														<li>
															<a href="ui-breadcrumb.php">Breadcrumb</a>
														</li>
														<li>
															<a href="ui-cards.php">Card</a>
														</li>
														<li>
															<a href="ui-carousel.php">Carousel</a>
														</li>
														<li>
															<a href="ui-colors.php">Colors</a>
														</li>
														<li>
															<a href="ui-dropdowns.php">Dropdowns</a>
														</li>
														<li>
															<a href="ui-grid.php">Grid</a>
														</li>
														<li>
															<a href="ui-images.php">Images</a>
														</li>
														<li>
															<a href="ui-lightbox.php">Lightbox</a>
														</li>
														<li>
															<a href="ui-media.php">Media</a>
														</li>
														<li>
															<a href="ui-modals.php">Modals</a>
														</li>
														<li>
															<a href="ui-offcanvas.php">Offcanvas</a>
														</li>
														<li>
															<a href="ui-pagination.php">Pagination</a>
														</li>
														<li>
															<a href="ui-popovers.php">Popovers</a>
														</li>
														<li>
															<a href="ui-progress.php">Progress</a>
														</li>
														<li>
															<a href="ui-placeholders.php">Placeholders</a>
														</li>
														<li>
															<a href="ui-spinner.php">Spinner</a>
														</li>
														<li>
															<a href="ui-sweetalerts.php">Sweet Alerts</a>
														</li>
														<li>
															<a href="ui-nav-tabs.php">Tabs</a>
														</li>
														<li>
															<a href="ui-toasts.php">Toasts</a>
														</li>
														<li>
															<a href="ui-tooltips.php">Tooltips</a>
														</li>
														<li>
															<a href="ui-typography.php">Typography</a>
														</li>
														<li>
															<a href="ui-video.php">Video</a>
														</li>
														<li>
															<a href="ui-sortable.php">Sortable</a>
														</li>
														<li>
															<a href="ui-swiperjs.php">Swiperjs</a>
														</li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-hierarchy-3"></i>
														<span>Advanced UI</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li>
															<a href="ui-ribbon.php">Ribbon</a>
														</li>
														<li>
															<a href="ui-clipboard.php">Clipboard</a>
														</li>
														<li>
															<a href="ui-drag-drop.php">Drag & Drop</a>
														</li>
														<li>
															<a href="ui-rangeslider.php">Range Slider</a>
														</li>
														<li>
															<a href="ui-rating.php">Rating</a>
														</li>
														<li>
															<a href="ui-text-editor.php">Text Editor</a>
														</li>
														<li>
															<a href="ui-counter.php">Counter</a>
														</li>
														<li>
															<a href="ui-scrollbar.php">Scrollbar</a>
														</li>
														<li>
															<a href="ui-stickynote.php">Sticky Note</a>
														</li>
														<li>
															<a href="ui-timeline.php">Timeline</a>
														</li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-input-search"></i>
														<span>Forms</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li class="submenu submenu-two">
															<a href="javascript:void(0);">Form Elements <span class="menu-arrow inside-submenu"></span>
															</a>
															<ul>
																<li>
																	<a href="form-basic-inputs.php">Basic Inputs</a>
																</li>
																<li>
																	<a href="form-checkbox-radios.php">Checkbox & Radios</a>
																</li>
																<li>
																	<a href="form-input-groups.php">Input Groups</a>
																</li>
																<li>
																	<a href="form-grid-gutters.php">Grid & Gutters</a>
																</li>
																<li>
																	<a href="form-select.php">Form Select</a>
																</li>
																<li>
																	<a href="form-mask.php">Input Masks</a>
																</li>
																<li>
																	<a href="form-fileupload.php">File Uploads</a>
																</li>
															</ul>
														</li>
														<li class="submenu submenu-two">
															<a href="javascript:void(0);">Layouts <span class="menu-arrow inside-submenu"></span>
															</a>
															<ul>
																<li>
																	<a href="form-horizontal.php">Horizontal Form</a>
																</li>
																<li>
																	<a href="form-vertical.php">Vertical Form</a>
																</li>
																<li>
																	<a href="form-floating-labels.php">Floating Labels</a>
																</li>
															</ul>
														</li>
														<li>
															<a href="form-validation.php">Form Validation</a>
														</li>

														<li>
															<a href="form-select2.php">Select2</a>
														</li>
														<li>
															<a href="form-wizard.php">Form Wizard</a>
														</li>
														<li>
															<a href="form-pickers.php">Form Pickers</a>
														</li>

													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-table-plus"></i>
														<span>Tables</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li>
															<a href="tables-basic.php">Basic Tables </a>
														</li>
														<li>
															<a href="data-tables.php">Data Table </a>
														</li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-chart-line"></i>
														<span>Charts</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li>
															<a href="chart-apex.php">Apex Charts</a>
														</li>
														<li>
															<a href="chart-c3.php">Chart C3</a>
														</li>
														<li>
															<a href="chart-js.php">Chart Js</a>
														</li>
														<li>
															<a href="chart-morris.php">Morris Charts</a>
														</li>
														<li>
															<a href="chart-flot.php">Flot Charts</a>
														</li>
														<li>
															<a href="chart-peity.php">Peity Charts</a>
														</li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-icons"></i>
														<span>Icons</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li>
															<a href="icon-fontawesome.php">Fontawesome Icons</a>
														</li>
														<li>
															<a href="icon-tabler.php">Tabler Icons</a>
														</li>
														<li>
															<a href="icon-bootstrap.php">Bootstrap Icons</a>
														</li>
														<li>
															<a href="icon-remix.php">Remix Icons</a>
														</li>
														<li>
															<a href="icon-feather.php">Feather Icons</a>
														</li>
														<li>
															<a href="icon-ionic.php">Ionic Icons</a>
														</li>
														<li>
															<a href="icon-material.php">Material Icons</a>
														</li>
														<li>
															<a href="icon-pe7.php">Pe7 Icons</a>
														</li>
														<li>
															<a href="icon-simpleline.php">Simpleline Icons</a>
														</li>
														<li>
															<a href="icon-themify.php">Themify Icons</a>
														</li>
														<li>
															<a href="icon-weather.php">Weather Icons</a>
														</li>
														<li>
															<a href="icon-typicon.php">Typicon Icons</a>
														</li>
														<li>
															<a href="icon-flag.php">Flag Icons</a>
														</li>
													</ul>
												</li>
												<li class="submenu">
													<a href="javascript:void(0);">
														<i class="ti ti-table-plus"></i>
														<span>Maps</span>
														<span class="menu-arrow"></span>
													</a>
													<ul>
														<li>
															<a href="maps-vector.php">Vector</a>
														</li>
														<li>
															<a href="maps-leaflet.php">Leaflet</a>
														</li>
													</ul>
												</li>
											</ul>
										</li>
										<li><a href="#">Documentation</a></li>
										<li><a href="#">Change Log</a></li>
										<li class="submenu">
											<a href="javascript:void(0);"><span>Multi Level</span><span class="menu-arrow"></span></a>
											<ul>
												<li><a href="javascript:void(0);">Multilevel 1</a></li>
												<li class="submenu submenu-two">
													<a href="javascript:void(0);">Multilevel 2<span class="menu-arrow inside-submenu"></span></a>
													<ul>
														<li><a href="javascript:void(0);">Multilevel 2.1</a></li>
														<li class="submenu submenu-two submenu-three">
															<a href="javascript:void(0);">Multilevel 2.2<span class="menu-arrow inside-submenu inside-submenu-two"></span></a>
															<ul>
																<li><a href="javascript:void(0);">Multilevel 2.2.1</a></li>
																<li><a href="javascript:void(0);">Multilevel 2.2.2</a></li>
															</ul>
														</li>
													</ul>
												</li>
												<li><a href="javascript:void(0);">Multilevel 3</a></li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!-- /Horizontal Single -->

				<div class="d-flex align-items-center">
					<div class="me-1">
						<a href="#" class="btn btn-menubar btnFullscreen">
							<i class="ti ti-maximize"></i>
						</a>
					</div>
					<div class="dropdown me-1">
						<a href="#" class="btn btn-menubar" data-bs-toggle="dropdown">
							<i class="ti ti-layout-grid-remove"></i>
						</a>
						<div class="dropdown-menu dropdown-menu-end">
							<div class="card mb-0 border-0 shadow-none">
								<div class="card-header">
									<h4>Applications</h4>
								</div>
								<div class="card-body">
									<a href="calendar.php" class="d-block pb-2">
										<span class="avatar avatar-md bg-transparent-dark me-2"><i class="ti ti-calendar text-gray-9"></i></span>Calendar
									</a>
									<a href="todo.php" class="d-block py-2">
										<span class="avatar avatar-md bg-transparent-dark me-2"><i class="ti ti-subtask text-gray-9"></i></span>To Do
									</a>
									<a href="notes.php" class="d-block py-2">
										<span class="avatar avatar-md bg-transparent-dark me-2"><i class="ti ti-notes text-gray-9"></i></span>Notes
									</a>
									<a href="file-manager.php" class="d-block py-2">
										<span class="avatar avatar-md bg-transparent-dark me-2"><i class="ti ti-folder text-gray-9"></i></span>File Manager
									</a>
									<a href="kanban-view.php" class="d-block py-2">
										<span class="avatar avatar-md bg-transparent-dark me-2"><i class="ti ti-layout-kanban text-gray-9"></i></span>Kanban
									</a>
									<a href="invoices.php" class="d-block py-2 pb-0">
										<span class="avatar avatar-md bg-transparent-dark me-2"><i class="ti ti-file-invoice text-gray-9"></i></span>Invoices
									</a>
								</div>
							</div>
						</div>
					</div>
					<div class="me-1">
						<a href="chat.php" class="btn btn-menubar position-relative">
							<i class="ti ti-brand-hipchat"></i>
							<span class="badge bg-info rounded-pill d-flex align-items-center justify-content-center header-badge">5</span>
						</a>
					</div>
					<div class="me-1">
						<a href="email.php" class="btn btn-menubar">
							<i class="ti ti-mail"></i>
						</a>
					</div>
					<div class="me-1 notification_item">
						<a href="#" class="btn btn-menubar position-relative me-1" id="notification_popup"
							data-bs-toggle="dropdown">
							<i class="ti ti-bell"></i>
							<span class="notification-status-dot"></span>
						</a>
						<div class="dropdown-menu dropdown-menu-end notification-dropdown p-4">
							<div class="d-flex align-items-center justify-content-between border-bottom p-0 pb-3 mb-3">
								<h4 class="notification-title">Notifications (2)</h4>
								<div class="d-flex align-items-center">
									<a href="#" class="text-primary fs-15 me-3 lh-1">Mark all as read</a>
									<div class="dropdown">
										<a href="javascript:void(0);" class="bg-white dropdown-toggle"
											data-bs-toggle="dropdown">
											<i class="ti ti-calendar-due me-1"></i>Today
										</a>
										<ul class="dropdown-menu mt-2 p-3">
											<li>
												<a href="javascript:void(0);" class="dropdown-item rounded-1">
													This Week
												</a>
											</li>
											<li>
												<a href="javascript:void(0);" class="dropdown-item rounded-1">
													Last Week
												</a>
											</li>
											<li>
												<a href="javascript:void(0);" class="dropdown-item rounded-1">
													Last Month
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="noti-content">
								<div class="d-flex flex-column">
									<div class="border-bottom mb-3 pb-3">
										<a href="activity.php">
											<div class="d-flex">
												<span class="avatar avatar-lg me-2 flex-shrink-0">
													<img src="assets/img/profiles/avatar-27.jpg" alt="Profile">
												</span>
												<div class="flex-grow-1">
													<p class="mb-1"><span
															class="text-dark fw-semibold">Shawn</span>
														performance in Math is below the threshold.</p>
													<span>Just Now</span>
												</div>
											</div>
										</a>
									</div>
									<div class="border-bottom mb-3 pb-3">
										<a href="activity.php" class="pb-0">
											<div class="d-flex">
												<span class="avatar avatar-lg me-2 flex-shrink-0">
													<img src="assets/img/profiles/avatar-23.jpg" alt="Profile">
												</span>
												<div class="flex-grow-1">
													<p class="mb-1"><span
															class="text-dark fw-semibold">Sylvia</span> added
														appointment on 02:00 PM</p>
													<span>10 mins ago</span>
													<div
														class="d-flex justify-content-start align-items-center mt-1">
														<span class="btn btn-light btn-sm me-2">Deny</span>
														<span class="btn btn-primary btn-sm">Approve</span>
													</div>
												</div>
											</div>
										</a>
									</div>
									<div class="border-bottom mb-3 pb-3">
										<a href="activity.php">
											<div class="d-flex">
												<span class="avatar avatar-lg me-2 flex-shrink-0">
													<img src="assets/img/profiles/avatar-25.jpg" alt="Profile">
												</span>
												<div class="flex-grow-1">
													<p class="mb-1">New student record <span class="text-dark fw-semibold"> George</span> is created by <span class="text-dark fw-semibold">Teressa</span></p>
													<span>2 hrs ago</span>
												</div>
											</div>
										</a>
									</div>
									<div class="border-0 mb-3 pb-0">
										<a href="activity.php">
											<div class="d-flex">
												<span class="avatar avatar-lg me-2 flex-shrink-0">
													<img src="assets/img/profiles/avatar-01.jpg" alt="Profile">
												</span>
												<div class="flex-grow-1">
													<p class="mb-1">A new teacher record for <span class="text-dark fw-semibold">Elisa</span> </p>
													<span>09:45 AM</span>
												</div>
											</div>
										</a>
									</div>
								</div>
							</div>
							<div class="d-flex p-0">
								<a href="#" class="btn btn-light w-100 me-2">Cancel</a>
								<a href="activity.php" class="btn btn-primary w-100">View All</a>
							</div>
						</div>
					</div>
					<div class="dropdown profile-dropdown">
						<a href="javascript:void(0);" class="dropdown-toggle d-flex align-items-center"
							data-bs-toggle="dropdown">
							<span class="avatar avatar-sm online">
								<img src="assets/img/profiles/avatar-12.jpg" alt="Img" class="img-fluid rounded-circle">
							</span>
						</a>
						<div class="dropdown-menu shadow-none">
							<div class="card mb-0">
								<div class="card-header">
									<div class="d-flex align-items-center">
										<span class="avatar avatar-lg me-2 avatar-rounded">
											<img src="assets/img/profiles/avatar-12.jpg" alt="img">
										</span>
										<div>
											<h5 class="mb-0">Kevin Larry</h5>
											<p class="fs-12 fw-medium mb-0"><a href="cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="9fe8feededfaf1dffae7fef2eff3fab1fcf0f2">[email&#160;protected]</a></p>
										</div>
									</div>
								</div>
								<div class="card-body">
									<a class="dropdown-item d-inline-flex align-items-center p-0 py-2" href="profile.php">
										<i class="ti ti-user-circle me-1"></i>My Profile
									</a>
									<a class="dropdown-item d-inline-flex align-items-center p-0 py-2" href="bussiness-settings.php">
										<i class="ti ti-settings me-1"></i>Settings
									</a>

									<a class="dropdown-item d-inline-flex align-items-center p-0 py-2" href="profile-settings.php">
										<i class="ti ti-circle-arrow-up me-1"></i>My Account
									</a>
									<a class="dropdown-item d-inline-flex align-items-center p-0 py-2" href="knowledgebase.php">
										<i class="ti ti-question-mark me-1"></i>Knowledge Base
									</a>
								</div>
								<div class="card-footer">
									<a class="dropdown-item d-inline-flex align-items-center p-0 py-2" href="logout.php?path=admin">
										<i class="ti ti-login me-2"></i>Logout
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		<div class="dropdown mobile-user-menu">
			<a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
			<div class="dropdown-menu dropdown-menu-end">
				<a class="dropdown-item" href="adminuseredit.php?usertoedit=admin">My Profile</a>
				<a class="dropdown-item" href="profile-settings.php">Settings</a>
				<a class="dropdown-item" href="logout.php?path=admin">Logout</a>
			</div>
		</div>
		<!-- /Mobile Menu -->

	</div>

</div>
<!-- /Header -->`;

export default function Topbar() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } finally {
        navigate("/login", { replace: true });
      }
    };

    return attachAdminNavigationHandlers(containerRef.current, navigate, {
      onLogout: handleLogout,
    });
  }, [navigate, logout]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: topbarHtml }} />;
}
