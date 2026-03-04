import React from 'react';
import { Link } from 'react-router-dom';

const AttendanceAdminPage = () => {
  return (
    <>
<div className="content">

				
				<div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
					<div className="my-auto mb-2">
						<h2 className="mb-1">Attendance Admin</h2>
						<nav>
							<ol className="breadcrumb mb-0">
								<li className="breadcrumb-item">
									<Link to="/admin-dashboard"><i className="ti ti-smart-home"></i></Link>
								</li>
								<li className="breadcrumb-item">
									Employee
								</li>
								<li className="breadcrumb-item active" aria-current="page">Attendance Admin</li>
							</ol>
						</nav>
					</div>
					<div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
						<div className="me-2 mb-2">
							<div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
								<a href="/attendance-employee" className="btn btn-icon btn-sm  me-1"><i
										className="ti ti-brand-days-counter"></i></a>
								<a href="/attendance-admin" className="btn btn-icon btn-sm active bg-primary text-white"><i
										className="ti ti-calendar-event"></i></a>
							</div>
						</div>
						<div className="me-2 mb-2">
							<div className="dropdown">
								<a href="javascript:void(0);"
									className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
									data-bs-toggle="dropdown">
									<i className="ti ti-file-export me-1"></i>Export
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1"><i
												className="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1"><i
												className="ti ti-file-type-xls me-1"></i>Export as Excel </a>
									</li>
								</ul>
							</div>
						</div>
						<div className="mb-2">
							<a href="#" className="btn btn-primary d-flex align-items-center"
								data-bs-target="#attendance_report" data-bs-toggle="modal"><i
									className="ti ti-file-analytics me-2"></i>Report</a>
						</div>
						<div className="ms-2 head-icons">
							<a href="javascript:void(0);" className="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
								<i className="ti ti-chevrons-up"></i>
							</a>
						</div>
					</div>
				</div>
				

				<div className="card border-0">
					<div className="card-body">
						<div className="row align-items-center mb-4">
							<div className="col-md-5">
								<div className="mb-3 mb-md-0">
									<h4 className="mb-1">Attendance Details Today</h4>
									<p>Data from the 800+ total no of employees</p>
								</div>
							</div>
							<div className="col-md-7">
								<div className="d-flex align-items-center justify-content-md-end">
									<h6>Total Absenties today</h6>
									<div className="avatar-list-stacked avatar-group-sm ms-4">
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="assets/img/profiles/avatar-02.jpg"
												alt="img" />
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="assets/img/profiles/avatar-03.jpg"
												alt="img" />
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="assets/img/profiles/avatar-05.jpg"
												alt="img" />
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="assets/img/profiles/avatar-06.jpg"
												alt="img" />
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="assets/img/profiles/avatar-07.jpg"
												alt="img" />
										</span>
										<a className="avatar bg-primary avatar-rounded text-fixed-white fs-12"
											href="javascript:void(0);">
											+1
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="border rounded">
							<div className="row gx-0">
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Present</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>250</h5>
											<span className="badge badge-success d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												+1%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Late Login</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>45</h5>
											<span className="badge badge-danger d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												-1%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Uninformed</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>15</h5>
											<span className="badge badge-danger d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												-12%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Permisson</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>03</h5>
											<span className="badge badge-success d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												+1%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Absent</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>12</h5>
											<span className="badge badge-danger d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												-19%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="card">
					<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<h5>Admin Attendance</h5>
						<div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">

							<div className="me-3">
								<div className="input-icon-end position-relative">
									<input type="text" className="form-control date-range bookingrange" placeholder="dd/mm/yyyy - dd/mm/yyyy" />
									<span className="input-icon-addon">
										<i className="ti ti-chevron-down"></i>
									</span>
								</div>
							</div>
							<div className="dropdown me-3">
								<a href="javascript:void(0);"
									className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
									data-bs-toggle="dropdown">
									Department
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Finance</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Application
											Development</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">IT Management</a>
									</li>
								</ul>
							</div>
							<div className="dropdown me-3">
								<a href="javascript:void(0);"
									className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
									data-bs-toggle="dropdown">
									Select Status
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Present</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Absent</a>
									</li>
								</ul>
							</div>
							<div className="dropdown">
								<a href="javascript:void(0);"
									className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
									data-bs-toggle="dropdown">
									Sort By : Last 7 Days
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Recently Added</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Ascending</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Desending</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Last Month</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Last 7 Days</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="custom-datatable-filter table-responsive">
							<table className="table datatable">
								<thead className="thead-light">
									<tr>
										<th className="no-sort">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" id="select-all" />
											</div>
										</th>
										<th>Employee</th>
										<th>Status</th>
										<th>Check In</th>
										<th>Check Out</th>
										<th>Break</th>
										<th>Late</th>
										<th>Production Hours</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-49.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Anthony Lewis</a></h6>
													<span className="fs-12 fw-normal ">UI/UX Team</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											06:45 PM
										</td>
										<td>30 Min</td>
										<td>
											32 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>8.55 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-09.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Brian Villalobos</a></h6>
													<span className="fs-12 fw-normal ">Development</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											06:12 PM
										</td>
										<td>20 Min</td>
										<td>
											20 Min
										</td>
										<td><span className="badge badge-danger d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>7.54 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-01.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Harvey Smith</a></h6>
													<span className="fs-12 fw-normal ">HR</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											06:13 PM
										</td>
										<td>50 Min</td>
										<td>
											23 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>8.45 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-33.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Stephan Peralt</a></h6>
													<span className="fs-12 fw-normal ">Management</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											06:23 PM
										</td>
										<td>41 Min</td>
										<td>
											50 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>8.35 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-34.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Doglas Martini</a></h6>
													<span className="fs-12 fw-normal ">Development</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											06:43 PM
										</td>
										<td>23 Min</td>
										<td>
											10 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>8.22 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-02.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Linda Ray</a></h6>
													<span className="fs-12 fw-normal ">UI/UX Team</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											07:15 PM
										</td>
										<td>03 Min</td>
										<td>
											30 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>8.32 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-35.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Elliot Murray</a></h6>
													<span className="fs-12 fw-normal ">UI/UX Team</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											07:13 PM
										</td>
										<td>32 Min</td>
										<td>
											41 Min
										</td>
										<td><span className="badge badge-info d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>9.15 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-30.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Rebecca Smtih</a></h6>
													<span className="fs-12 fw-normal ">UI/UX Team</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											09:17 PM
										</td>
										<td>14 Min</td>
										<td>
											12 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>9.25 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-36.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Connie Waters</a></h6>
													<span className="fs-12 fw-normal ">Management</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-success-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Present</span></td>
										<td>09:00 AM</td>
										<td>
											08:15 PM
										</td>
										<td>12 Min</td>
										<td>
											03 Min
										</td>
										<td><span className="badge badge-success d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>8.35 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-38.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Lori Broaddus</a></h6>
													<span className="fs-12 fw-normal ">Finance</span>
												</div>
											</div>
										</td>
										<td><span
												className="badge badge-danger-transparent d-inline-flex align-items-center"><i
													className="ti ti-point-filled me-1"></i>Absent</span></td>
										<td>-</td>
										<td>
											-
										</td>
										<td>-</td>
										<td>
											-
										</td>
										<td><span className="badge badge-danger d-inline-flex align-items-center"><i
													className="ti ti-clock-hour-11 me-1"></i>0.00 Hrs</span></td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal"
													data-bs-target="#edit_attendance"><i className="ti ti-edit"></i></a>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

			</div>

			


		

		
		<div className="modal fade" id="edit_attendance">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title">Edit Attendance</h4>
						<button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
							<i className="ti ti-x"></i>
						</button>
					</div>
					<form action="attendance-admin.php">
						<div className="modal-body pb-0">
							<div className="row">
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Date</label>
										<div className="input-icon position-relative w-100 me-2">
											<input type="text" className="form-control datetimepicker ps-3"
												defaultValue="15 Apr 2025" />
											<span className="input-icon-addon">
												<i className="ti ti-calendar"></i>
											</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Check In</label>
										<div className="input-icon position-relative w-100">
											<input type="text" className="form-control timepicker ps-3" defaultValue="09:00 AM" />
											<span className="input-icon-addon">
												<i className="ti ti-clock-hour-3"></i>
											</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Check Out</label>
										<div className="input-icon position-relative w-100">
											<input type="text" className="form-control timepicker ps-3" defaultValue="06:45 PM" />
											<span className="input-icon-addon">
												<i className="ti ti-clock-hour-3"></i>
											</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Break</label>
										<input type="text" className="form-control" defaultValue="30 Min	" />
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Late</label>
										<input type="text" className="form-control" defaultValue="32 Min" />
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Production Hours</label>
										<div className="input-icon position-relative w-100">
											<input type="text" className="form-control timepicker ps-3" defaultValue="8.55 Hrs" />
											<span className="input-icon-addon">
												<i className="ti ti-clock-hour-3"></i>
											</span>
										</div>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3 ">
										<label className="form-label">Status</label>
										<select className="form-select">
											<option>Select</option>
											<option>Present</option>
											<option>Absent</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary">Save Changes</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		

		
		<div className="modal fade" id="attendance_report">
			<div className="modal-dialog modal-dialog-centered modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title">Attendance</h4>
						<button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal"
							aria-label="Close">
							<i className="ti ti-x"></i>
						</button>
					</div>
					<div className="modal-body">
						<div className="card shadow-none bg-transparent-light">
							<div className="card-body pb-1">
								<div className="row align-items-center">
									<div className="col-lg-4">
										<div className="d-flex align-items-center mb-3">
											<span className="avatar avatar-sm avatar-rounded flex-shrink-0 me-2">
												<img src="assets/img/profiles/avatar-02.jpg" alt="Img" />
											</span>
											<div>
												<h6 className="fw-medium">Anthony Lewis</h6>
												<span>UI/UX Team</span>
											</div>
										</div>
									</div>
									<div className="col-lg-8">
										<div className="row">
											<div className="col-sm-3">
												<div className="mb-3 text-sm-end">
													<span>Date</span>
													<p className="text-gray-9 fw-medium">15 Apr 2025</p>
												</div>
											</div>
											<div className="col-sm-3">
												<div className="mb-3 text-sm-end">
													<span>Punch in at</span>
													<p className="text-gray-9 fw-medium">09:00 AM</p>
												</div>
											</div>
											<div className="col-sm-3">
												<div className="mb-3 text-sm-end">
													<span>Punch out at</span>
													<p className="text-gray-9 fw-medium">06:45 PM</p>
												</div>
											</div>
											<div className="col-sm-3">
												<div className="mb-3 text-sm-end">
													<span>Status</span>
													<p className="text-gray-9 fw-medium">Present</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card shadow-none border mb-0">
							<div className="card-body">
								<div className="row">
									<div className="col-xl-3">
										<div className="mb-4">
											<p className="d-flex align-items-center mb-1"><i
													className="ti ti-point-filled text-dark-transparent me-1"></i>Total
												Working hours</p>
											<h3>12h 36m</h3>
										</div>
									</div>
									<div className="col-xl-3">
										<div className="mb-4">
											<p className="d-flex align-items-center mb-1"><i
													className="ti ti-point-filled text-success me-1"></i>Productive Hours
											</p>
											<h3>08h 36m</h3>
										</div>
									</div>
									<div className="col-xl-3">
										<div className="mb-4">
											<p className="d-flex align-items-center mb-1"><i
													className="ti ti-point-filled text-warning me-1"></i>Break hours</p>
											<h3>22m 15s</h3>
										</div>
									</div>
									<div className="col-xl-3">
										<div className="mb-4">
											<p className="d-flex align-items-center mb-1"><i
													className="ti ti-point-filled text-info me-1"></i>Overtime</p>
											<h3>02h 15m</h3>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-8 mx-auto">
										<div className="progress bg-transparent-dark mb-3" style={{"height":"24px"}}>
											<div className="progress-bar bg-success rounded me-2" role="progressbar"
												style={{"width":"18%"}}></div>
											<div className="progress-bar bg-warning rounded me-2" role="progressbar"
												style={{"width":"5%"}}></div>
											<div className="progress-bar bg-success rounded me-2" role="progressbar"
												style={{"width":"28%"}}></div>
											<div className="progress-bar bg-warning rounded me-2" role="progressbar"
												style={{"width":"17%"}}></div>
											<div className="progress-bar bg-success rounded me-2" role="progressbar"
												style={{"width":"22%"}}></div>
											<div className="progress-bar bg-warning rounded me-2" role="progressbar"
												style={{"width":"5%"}}></div>
											<div className="progress-bar bg-info rounded me-2" role="progressbar"
												style={{"width":"3%"}}></div>
											<div className="progress-bar bg-info rounded" role="progressbar"
												style={{"width":"2%"}}></div>
										</div>

									</div>
									<div className="co-md-12">
										<div className="d-flex align-items-center justify-content-between">
											<span className="fs-10">06:00</span>
											<span className="fs-10">07:00</span>
											<span className="fs-10">08:00</span>
											<span className="fs-10">09:00</span>
											<span className="fs-10">10:00</span>
											<span className="fs-10">11:00</span>
											<span className="fs-10">12:00</span>
											<span className="fs-10">01:00</span>
											<span className="fs-10">02:00</span>
											<span className="fs-10">03:00</span>
											<span className="fs-10">04:00</span>
											<span className="fs-10">05:00</span>
											<span className="fs-10">06:00</span>
											<span className="fs-10">07:00</span>
											<span className="fs-10">08:00</span>
											<span className="fs-10">09:00</span>
											<span className="fs-10">10:00</span>
											<span className="fs-10">11:00</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		

	
	

	


    </>
  );
};

export default AttendanceAdminPage;
