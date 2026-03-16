import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import DealsGridPage from "./DealsGridPage";
import { getDeals, deleteDeal } from "../../api/dealsApi";
import { extractApiErrorMessage } from "../../utils/errorMessage";

function formatDateTime(value) {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  } catch {
    return String(value);
  }
}

function EditGlyph({ size = 14, className = "" }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function PhoneGlyph({ size = 14, className = "" }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.1 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L9.1 10.6a16 16 0 0 0 4.3 4.3l1.17-1.15a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function NoteGlyph({ size = 14, className = "" }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

const DealsPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const viewFromQuery = searchParams.get("view") === "grid" ? "grid" : "list";
	const view = location.pathname.endsWith("/deals-grid") ? "grid" : viewFromQuery;

	const [deals, setDeals] = useState([]);
	const [filteredDeals, setFilteredDeals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [selectedDealId, setSelectedDealId] = useState(null);

	// Load deals from backend
	useEffect(() => {
		loadDeals();
	}, []);

	// Filter deals based on search text
	useEffect(() => {
		if (searchText.trim() === "") {
			setFilteredDeals(deals);
		} else {
			const searchLower = searchText.toLowerCase();
			const filtered = deals.filter(deal => {
				return (
					(deal?.name || "").toLowerCase().includes(searchLower) ||
					(deal?.mobile || "").toLowerCase().includes(searchLower) ||
					String(deal?.id || "").toLowerCase().includes(searchLower) ||
					(deal?.primarySource || "").toLowerCase().includes(searchLower) ||
					(deal?.secondarySource || "").toLowerCase().includes(searchLower) ||
					(deal?.projectName || "").toLowerCase().includes(searchLower) ||
					(deal?.owner || "").toLowerCase().includes(searchLower)
				);
			});
			setFilteredDeals(filtered);
		}
	}, [searchText, deals]);

	const loadDeals = async () => {
		setLoading(true);
		try {
			const dealsList = await getDeals();
			setDeals(dealsList || []);
			setError(null);
		} catch (e) {
			setError(extractApiErrorMessage(e, "Failed to load deals"));
			setDeals([]);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteDeal = async (dealId) => {
		if (!dealId) return;
		try {
			await deleteDeal(dealId);
			setDeals(deals.filter(d => d.id !== dealId));
			setSelectedDealId(null);
		} catch (e) {
			setError(extractApiErrorMessage(e, "Failed to delete deal"));
		}
	};

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
				
				{error && (
					<div className="alert alert-danger alert-dismissible fade show" role="alert">
						{error}
						<button type="button" className="btn-close" onClick={() => setError(null)}></button>
					</div>
				)}
				
				<div className="card">
					<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<h5>Deal List</h5>
						<div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
							<input
								type="text"
								placeholder="Search by name, ID, company, or owner..."
								className="form-control form-control-sm"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								style={{ width: "300px" }}
							/>
						</div>
					</div>
					<div className="card-body p-0">
						{loading ? (
							<div className="text-center p-4">
								<p>Loading deals...</p>
							</div>
						) : filteredDeals.length === 0 ? (
							<div className="text-center p-4">
								<p>No deals found</p>
							</div>
						) : (
						<div className="table-responsive">
							<table className="table table-hover align-middle">
								<thead>
									<tr>
										<th style={{ width: 36 }}>
											<input type="checkbox" />
										</th>
										<th className="text-nowrap">
											#
											<span className="ms-1 text-muted d-inline-flex align-items-center">
												<EditGlyph size={12} />
											</span>
										</th>
										<th>Name</th>
										<th>Mobile</th>
										<th>Primary</th>
										<th>Secondary</th>
										<th>Projects</th>
										<th className="text-nowrap">
											Status
											<span className="ms-1 d-inline-flex align-items-center" style={{ color: "#6f65d6" }}>
												<EditGlyph size={12} />
											</span>
										</th>
										<th>Remarks</th>
										<th>Owner</th>
										<th>Created Date</th>
									</tr>
								</thead>
								<tbody>
									{filteredDeals.map((deal, index) => (
										<tr key={deal.id}>
											<td>
												<input type="checkbox" />
											</td>
											<td>
												<div className="d-inline-flex align-items-center gap-2">
													<span>{index + 1}</span>
													<button
														className="btn btn-sm d-inline-flex align-items-center justify-content-center"
														style={{ backgroundColor: "#6f65d6", color: "#fff", width: 24, height: 24, padding: 0, borderRadius: 4, border: "none" }}
													onClick={() => navigate(`/deal/${deal.id}`)}
														title="Edit Deal"
													>
														<EditGlyph size={11} />
													</button>
													<button
														className="btn btn-sm d-inline-flex align-items-center justify-content-center"
														style={{ backgroundColor: "#e74c3c", color: "#fff", width: 24, height: 24, padding: 0, borderRadius: 4, border: "none" }}
														onClick={() => {
															setSelectedDealId(deal.id);
															const deleteModal = new window.bootstrap.Modal(document.getElementById("delete_modal"));
															deleteModal.show();
														}}
														title="Delete Deal"
													>
														<i className="ti ti-trash" />
													</button>
												</div>
											</td>
											<td>{deal.name || "-"}</td>
											<td>
												<div className="d-flex align-items-center gap-2">
													<span>{deal.mobile || "-"}</span>
													{deal.mobile && (
														<a className="btn btn-sm btn-outline-secondary" href={`tel:${deal.mobile}`}>
															<PhoneGlyph size={12} />
														</a>
													)}
												</div>
											</td>
											<td>{deal.primarySource || "-"}</td>
											<td>{deal.secondarySource || "-"}</td>
											<td>{deal.projectName || "-"}</td>
											<td>
												<div className="d-inline-flex align-items-center gap-2">
													<span>{deal.status || "-"}</span>
													<button
														className="btn btn-sm d-inline-flex align-items-center justify-content-center"
														style={{ backgroundColor: "#6f65d6", color: "#fff", width: 24, height: 24, padding: 0, borderRadius: 4, border: "none" }}
														onClick={() => navigate(`/deal/${deal.id}`)}
														title="Edit Deal"
													>
														<EditGlyph size={11} />
													</button>
												</div>
											</td>
											<td>
												<button
													className="btn btn-sm d-inline-flex align-items-center justify-content-center"
													style={{ backgroundColor: "#6f65d6", color: "#fff", width: 24, height: 24, padding: 0, borderRadius: 4, border: "none" }}
													onClick={() => navigate(`/deal/${deal.id}`)}
													title="View / Edit Deal"
												>
													<NoteGlyph size={11} />
												</button>
											</td>
											<td>{deal.owner || "-"}</td>
											<td>{formatDateTime(deal.createdAt)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						)}
					</div>
				</div>
				

			</div>

			<div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
				<p className="mb-0">2014 - 2025 &copy; SmartHR.</p>
				<p>Designed &amp; Developed By <a href="javascript:void(0);" className="text-primary">Dreams</a></p>
			</div>

			<div className="modal fade" id="delete_modal" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-body text-center">
							<span className="avatar avatar-xl bg-danger-transparent rounded-circle mb-3">
								<i className="ti ti-trash-x fs-24"></i>
							</span>
							<h4 className="mb-2">Delete Deal</h4>
							<p className="mb-3">Are you sure you want to delete this deal?</p>
							<div className="d-flex">
								<button
									type="button"
									className="btn btn-light me-2 flex-fill"
									data-bs-dismiss="modal"
									onClick={() => setSelectedDealId(null)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-danger flex-fill"
									onClick={() => {
										if (selectedDealId) {
											handleDeleteDeal(selectedDealId);
											const deleteModal = window.bootstrap.Modal.getInstance(
												document.getElementById("delete_modal")
											);
											deleteModal?.hide();
										}
									}}
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

		
        </>
    );
};

export default DealsPage;
