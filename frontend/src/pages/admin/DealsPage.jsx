import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import DealsGridPage from "./DealsGridPage";

const DealsPage = () => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const viewFromQuery = searchParams.get("view") === "grid" ? "grid" : "list";
	const view = location.pathname.endsWith("/deals-grid") ? "grid" : viewFromQuery;

	if (view === "grid") {
		return <DealsGridPage />;
	}

    return (
        <>
            
			<div className="content">

				
				<div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
					<div className="my-auto mb-2">
						<h2 className="mb-1">Deals</h2>
						<nav>
							<ol className="breadcrumb mb-0">
								<li className="breadcrumb-item">
									<a href="admin-dashboard.php"><i className="ti ti-smart-home"></i></a>
								</li>
								<li className="breadcrumb-item">
									CRM
								</li>
								<li className="breadcrumb-item active" aria-current="page">Deals List</li>
							</ol>
						</nav>
					</div>
					<div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
						<div className="me-2 mb-2">
							<div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
								<button
									type="button"
									onClick={() => setSearchParams({})}
									className="btn btn-icon btn-sm active bg-primary text-white me-1"
								>
									<i className="ti ti-list-tree"></i>
								</button>
								<button
									type="button"
									onClick={() => setSearchParams({ view: "grid" })}
									className="btn btn-icon btn-sm"
								>
									<i className="ti ti-layout-grid"></i>
								</button>
							</div>
						</div>
						<div className="mb-2">
							<a href="#" data-bs-toggle="modal" data-bs-target="#add_deals" className="btn btn-primary d-flex align-items-center"><i className="ti ti-circle-plus me-2"></i>Add Deal</a>
						</div>
						<div className="head-icons ms-2">
							<a href="javascript:void(0);" className="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
								<i className="ti ti-chevrons-up"></i>
							</a>
						</div>
					</div>
				</div>
				
				<div className="card">
					<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<h5>Deal List</h5>
						<div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"></div>
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
										<th>Deal Name</th>
										<th>Stage</th>
										<th>Deal Value</th>
										<th>Tags</th>
										<th>Expected Closed Date</th>
										<th>Owner</th>
										<th>Probability</th>
										<th>Status</th>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Collins</a></h6>
										</td>
										<td>Quality To Buy</td>
										<td>$4,50,000</td>
										<td>
											<span className="badge badge-info-transparent">Promotion</span>
										</td>
										<td>14 Jan 2024</td>
										<td>Hendry</td>
										<td>
											70%
										</td>
										<td>
											<span className="badge badge-info d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Open
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Konopelski</a></h6>
										</td>
										<td>Proposal Made</td>
										<td>$3,15,000</td>
										<td>
											<span className="badge badge-warning-transparent">Rated</span>
										</td>
										<td>21 Jan 2024</td>
										<td>Guilory</td>
										<td>
											85%
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Won
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Adams</a></h6>
										</td>
										<td>Contact Made</td>
										<td>$8,40,000</td>
										<td>
											<span className="badge badge-info-transparent">Promotion</span>
										</td>
										<td>20 Feb 2024</td>
										<td>Jami</td>
										<td>
											60%
										</td>
										<td>
											<span className="badge badge-info d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Open
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Schumm</a></h6>
										</td>
										<td>Quality To Buy</td>
										<td>$6,10,000</td>
										<td>
											<span className="badge badge-pink-transparent">Collab</span>
										</td>
										<td>15 Mar 2024</td>
										<td>Theresa</td>
										<td>
											75%
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Won
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Wisozk</a></h6>
										</td>
										<td>Presentation</td>
										<td>$4,70,000</td>
										<td>
											<span className="badge badge-danger-transparent">Rejected</span>
										</td>
										<td>12 Apr 2024</td>
										<td>Smith</td>
										<td>
											80%
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Won
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Heller</a></h6>
										</td>
										<td>Appointment</td>
										<td>$5,50,000</td>
										<td>
											<span className="badge badge-warning-transparent">Rated</span>
										</td>
										<td>20 Apr 2024</td>
										<td>Martin</td>
										<td>
											65%
										</td>
										<td>
											<span className="badge badge-danger d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Lost
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Gutkowski</a></h6>
										</td>
										<td>Qualify to Buy</td>
										<td>$5,00,000</td>
										<td>
											<span className="badge badge-purple-transparent">Calls</span>
										</td>
										<td>06 Jul 2024</td>
										<td>Newell</td>
										<td>
											90%
										</td>
										<td>
											<span className="badge badge-danger d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Lost
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Walter</a></h6>
										</td>
										<td>Proposal Made</td>
										<td>$4,50,000</td>
										<td>
											<span className="badge badge-danger-transparent">Rejected</span>
										</td>
										<td>02 Sep 2024</td>
										<td>Janet</td>
										<td>
											55%
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Won
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Hansen</a></h6>
										</td>
										<td>Presentation</td>
										<td>$6,20,000</td>
										<td>
											<span className="badge badge-pink-transparent">Collab</span>
										</td>
										<td>15 Nov 2024</td>
										<td>Craig</td>
										<td>
											95%
										</td>
										<td>
											<span className="badge badge-danger d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Lost
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
												<a href="#" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="ti ti-trash"></i></a>
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
											<h6 className="fw-medium fs-14"><a href="deals-details.php">Leuschke</a></h6>
										</td>
										<td>Appointment</td>
										<td>$7,40,000</td>
										<td>
											<span className="badge badge-purple-transparent">Calls</span>
										</td>
										<td>10 Dec 2024</td>
										<td>Daniel</td>
										<td>
											50%
										</td>
										<td>
											<span className="badge badge-success d-inline-flex align-items-center badge-xs">
												<i className="ti ti-point-filled me-1"></i>Won
											</span>
										</td>
										<td>
											<div className="action-icon d-inline-flex">
												<a href="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_deals"><i className="ti ti-edit"></i></a>
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

			<div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
				<p className="mb-0">2014 - 2025 &copy; SmartHR.</p>
				<p>Designed &amp; Developed By <a href="javascript:void(0);" className="text-primary">Dreams</a></p>
			</div>

		
        </>
    );
};

export default DealsPage;
