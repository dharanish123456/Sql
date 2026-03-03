import React from 'react';
import { Link } from 'react-router-dom';

const OvertimePage = () => {
  return (
    <>
<div className="content">

				
				<div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
					<div className="my-auto mb-2">
						<h2 className="mb-1">Overtime</h2>
						<nav>
							<ol className="breadcrumb mb-0">
								<li className="breadcrumb-item">
									<Link to="/dashboard"><i className="ti ti-smart-home"></i></Link>
								</li>
								<li className="breadcrumb-item">
									Employee
								</li>
								<li className="breadcrumb-item active" aria-current="page">Overtime</li>
							</ol>
						</nav>
					</div>
					<div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
						<div className="me-2 mb-2">
							<div className="dropdown">
								<a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
									<i className="ti ti-file-export me-1"></i>Export
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1"><i className="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1"><i className="ti ti-file-type-xls me-1"></i>Export as Excel </a>
									</li>
								</ul>
							</div>
						</div>
						<div className="mb-2">
							<a href="#" data-bs-toggle="modal" data-bs-target="#add_overtime" className="btn btn-primary d-flex align-items-center"><i className="ti ti-circle-plus me-2"></i>Add Overtime</a>
						</div>
						<div className="head-icons ms-2">
							<a href="javascript:void(0);" className="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
								<i className="ti ti-chevrons-up"></i>
							</a>
						</div>
					</div>
				</div>
				

				
				<div className="row">
					<div className="col-xl-3 col-md-6">
						<div className="card">
							<div className="card-body">
								<div className="d-flex align-items-center flex-wrap justify-content-between">
									<div>
										<p className="fs-12 fw-medium mb-0 text-gray-5">Overtime Employee</p>
										<h4>12</h4>
									</div>
									<div>
										<span className="p-2 br-10 bg-transparent-primary border border-primary d-flex align-items-center justify-content-center"><i className="ti ti-user-check text-primary fs-18"></i></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-md-6">
						<div className="card">
							<div className="card-body">
								<div className="d-flex align-items-center flex-wrap justify-content-between">
									<div>
										<p className="fs-12 fw-medium mb-0 text-gray-5">Overtime Hours</p>
										<h4>118</h4>
									</div>
									<div>
										<span className="p-2 br-10 bg-pink-transparent border border-pink d-flex align-items-center justify-content-center"><i className="ti ti-user-edit text-pink fs-18"></i></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-md-6">
						<div className="card">
							<div className="card-body">
								<div className="d-flex align-items-center flex-wrap justify-content-between">
									<div>
										<p className="fs-12 fw-medium mb-0 text-gray-5">Pending Request</p>
										<h4>23</h4>
									</div>
									<div>
										<span className="p-2 br-10 bg-transparent-purple border border-purple d-flex align-items-center justify-content-center"><i className="ti ti-user-exclamation text-purple fs-18"></i></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-md-6">
						<div className="card">
							<div className="card-body">
								<div className="d-flex align-items-center flex-wrap justify-content-between">
									<div>
										<p className="fs-12 fw-medium mb-0 text-gray-5">Rejected</p>
										<h4>5</h4>
									</div>
									<div>
										<span className="p-2 br-10 bg-skyblue-transparent border border-skyblue d-flex align-items-center justify-content-center"><i className="ti ti-user-exclamation text-skyblue fs-18"></i></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				

				
				<div className="card">
					<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<h5>Overtime</h5>
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
								<a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
									Employee
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Anthony Lewis</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Brian Villalobos</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Harvey Smith</a>
									</li>
								</ul>
							</div>
							<div className="dropdown me-3">
								<a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
									Project
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Office Management</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Project Management</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Hospital Administration</a>
									</li>
								</ul>
							</div>
							<div className="dropdown me-3">
								<a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
									Select Status
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Accepted</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1">Rejected</a>
									</li>
								</ul>
							</div>
							<div className="dropdown">
								<a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
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
										<th>Employee</th>
										<th>Date </th>
										<th>Overtime Hours</th>
										<th>Project</th>
										<th>Approved By</th>
										<th>Status</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-32.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Anthony Lewis</a></h6>
													<span className="fs-12 fw-normal ">UI/UX Team</span>
												</div>
											</div>
										</td>
										<td>
											14 Jan 2024
										</td>
										<td>32</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Office Management </a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-39.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Michael Walker</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
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
										<td>
											21 Jan 2024
										</td>
										<td>45</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Project Management</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-02.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Sophie Headrick</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
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
										<td>
											20 Feb 2024
										</td>
										<td>31</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Project Management</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-03.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Cameron Drake</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
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
										<td>
											15 Mar 2024
										</td>
										<td>45</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Hospital Administration</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-04.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Doris Crowley</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-danger d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Rejected
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
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
										<td>
											12 Apr 2024
										</td>
										<td>36</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Office Management</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-06.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Thomas Bordelon</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
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
										<td>
											20 Apr 2024
										</td>
										<td>49</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Hospital Administration</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-06.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Kathleen Gutierrez</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-35.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Elliot Murray</a></h6>
													<span className="fs-12 fw-normal ">Developer</span>
												</div>
											</div>
										</td>
										<td>
											06 Jul 2024
										</td>
										<td>57</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Video Calling App</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>

										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-07.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Bruce Wright</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-36.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Rebecca Smtih</a></h6>
													<span className="fs-12 fw-normal ">UI/UX Team</span>
												</div>
											</div>
										</td>
										<td>
											02 Sep 2024
										</td>
										<td>21</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Office Management</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-09.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Estelle Morgan</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-danger d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Rejected
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-37.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Connie Waters</a></h6>
													<span className="fs-12 fw-normal ">Management</span>
												</div>
											</div>
										</td>
										<td>
											15 Nov 2024
										</td>
										<td>32</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Project Management</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-10.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Stephen Dias</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/users/user-38.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Connie Waters</a></h6>
													<span className="fs-12 fw-normal ">Management</span>
												</div>
											</div>
										</td>
										<td>
											15 Nov 2024
										</td>
										<td>66</td>
										<td>
											<div className=" d-flex align-items-center">
												<a href="#" className="fs-14 fw-medium text-gray-9 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#overtime_details">Ware house developement</a>
												<a href="#" className="ms-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Worked on the Management
												design & Development"><i className="ti ti-info-circle text-info"></i></a>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center file-name-icon">
												<a href="#" className="avatar avatar-md border avatar-rounded">
													<img src="assets/img/reports/user-05.jpg" className="img-fluid" alt="img" />
												</a>
												<div className="ms-2">
													<h6 className="fw-medium"><a href="#">Angela Thomas</a></h6>
												</div>
											</div>
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Accepted
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_overtime"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				

			</div>

			

		

		
		<div className="modal fade" id="add_overtime">
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title">Add Overtime</h4>
						<button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
							<i className="ti ti-x"></i>
						</button>
					</div>
					<form action="overtime.php">
						<div className="modal-body pb-0">
							<div className="row">
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Employee<span className="text-danger"> *</span></label>
										<select className="form-select">
											<option>Select</option>
											<option>Anthony Lewis</option>
											<option>Brian Villalobos</option>
											<option>Harvey Smith</option>
										</select>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Overtime date <span className="text-danger"> *</span></label>
										<div className="input-icon-end position-relative">
											<input type="text" className="form-control datetimepicker" placeholder="dd/mm/yyyy" />
											<span className="input-icon-addon">
												<i className="ti ti-calendar text-gray-7"></i>
											</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Overtime<span className="text-danger"> *</span></label>
										<input type="text" className="form-control" />
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Remaining Hours<span className="text-danger"> *</span></label>
										<input type="text" className="form-control" />
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Description</label>
										<textarea className="form-control" rows="3"></textarea>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Status<span className="text-danger"> *</span></label>
										<select className="form-select">
											<option>Select</option>
											<option>Accepted</option>
											<option>Rejected</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary">Add Overtime</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		

		
		<div className="modal fade" id="edit_overtime">
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title">Edit Overtime</h4>
						<button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
							<i className="ti ti-x"></i>
						</button>
					</div>
					<form action="overtime.php">
						<div className="modal-body pb-0">
							<div className="row">
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Employee * <span className="text-danger"> *</span></label>
										<select className="form-select">
											<option>Select</option>
											<option selected>Anthony Lewis</option>
											<option>Brian Villalobos</option>
											<option>Harvey Smith</option>
										</select>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Overtime date <span className="text-danger"> *</span></label>
										<div className="input-icon-end position-relative">
											<input type="text" className="form-control datetimepicker" placeholder="dd/mm/yyyy" defaultValue="17-10-2024" />
											<span className="input-icon-addon">
												<i className="ti ti-calendar text-gray-7"></i>
											</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Overtime<span className="text-danger"> *</span></label>
										<input type="text" className="form-control" defaultValue="8" />
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label">Remaining Hours<span className="text-danger"> *</span></label>
										<input type="text" className="form-control" defaultValue="2" />
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Description</label>
										<textarea className="form-control" rows="3"></textarea>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Status<span className="text-danger"> *</span></label>
										<select className="form-select">
											<option>Select</option>
											<option selected>Accepted</option>
											<option>Rejected</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary">Add Overtime</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		

		
		<div className="modal fade" id="overtime_details">
			<div className="modal-dialog modal-dialog-centered modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title"> Overtime Details</h4>
						<button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
							<i className="ti ti-x"></i>
						</button>
					</div>
					<form action="overtime.php">
						<div className="modal-body pb-0">
							<div className="row">
								<div className="col-md-12">
									<div className="mb-3">
										<div className="p-3 mb-3 br-5 bg-transparent-light">
											<div className="row">
												<div className="col-md-4">
													<div className="d-flex align-items-center file-name-icon">
														<a href="#" className="avatar avatar-md border avatar-rounded">
															<img src="assets/img/users/user-32.jpg" className="img-fluid" alt="img" />
														</a>
														<div className="ms-2">
															<h6 className="fw-medium fs-14"><a href="#">Anthony Lewis</a></h6>
															<span className="fs-12 fw-normal ">UI/UX Team</span>
														</div>
													</div>
												</div>
												<div className="col-md-4">
													<div>
														<p className="fs-14 fw-normal mb-1">Hours Worked</p>
														<h6 className="fs-14 fw-medium">32</h6>
													</div>
												</div>
												<div className="col-md-4">
													<div>
														<p className="fs-14 fw-normal mb-1">Date</p>
														<h6 className="fs-14 fw-medium">15 Apr 2024</h6>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<h6 className="fs-14 fw-medium">Office Management</h6>
										<p className="fs-12 fw-normal">Worked on the Management design & Development</p>
									</div>
								</div>
								<div className="col-md-12">
									<div className="mb-3">
										<label className="form-label">Select Status <span className="text-danger"> *</span></label>
										<select className="form-select">
											<option>Select</option>
											<option>Accepted</option>
											<option>Rejected</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary">Submit</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		

		
		<div className="modal fade" id="delete_modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-body text-center">
						<span className="avatar avatar-xl bg-transparent-danger text-danger mb-3">
							<i className="ti ti-trash-x fs-36"></i>
						</span>
						<h4 className="mb-1">Confirm Delete</h4>
						<p className="mb-3">You want to delete all the marked items, this cant be undone once you delete.</p>
						<div className="d-flex justify-content-center">
							<a href="javascript:void(0);" className="btn btn-light me-3" data-bs-dismiss="modal">Cancel</a>
							<a href="/overtime" className="btn btn-danger">Yes, Delete</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		


	

	


    </>
  );
};

export default OvertimePage;