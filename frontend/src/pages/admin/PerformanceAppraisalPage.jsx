import React from "react";
import { Link } from "react-router-dom";

const PerformanceAppraisalPage = () => {
  return (
    <>
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">Performance Appraisal</h2>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    <i className="ti ti-smart-home"></i>
                  </Link>
                </li>
                <li className="breadcrumb-item">Performance</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Performance Appraisal
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
            <div className="mb-2">
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#add_performance_appraisal"
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="ti ti-circle-plus me-2"></i>Add Appraisal
              </a>
            </div>
            <div className="head-icons ms-2">
              <a
                href="javascript:void(0);"
                className=""
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-original-title="Collapse"
                id="collapse-header"
              >
                <i className="ti ti-chevrons-up"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h5>Performance Appraisal List</h5>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Recently Added
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Ascending
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Desending
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Last Month
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Last 7 Days
                    </a>
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
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="select-all"
                        />
                      </div>
                    </th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Appraisal Date</th>
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
                      <div className="d-flex align-items-center file-name-icon">
                        <a href="#" className="avatar avatar-md avatar-rounded">
                          <img
                            src="assets/img/users/user-32.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        </a>
                        <div className="ms-2">
                          <h6 className="fw-medium">
                            <a href="#">Anthony Lewis</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>Web Designer</td>
                    <td>Designing</td>
                    <td>14 Jan 2024</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_performance_appraisal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash"></i>
                        </a>
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
                        <a href="#" className="avatar avatar-md avatar-rounded">
                          <img
                            src="assets/img/users/user-09.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        </a>
                        <div className="ms-2">
                          <h6 className="fw-medium">
                            <a href="#">Brian Villalobos</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>Web Developer</td>
                    <td>Developer</td>
                    <td>21 Jan 2024</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_performance_appraisal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash"></i>
                        </a>
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
                        <a href="#" className="avatar avatar-md avatar-rounded">
                          <img
                            src="assets/img/users/user-01.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        </a>
                        <div className="ms-2">
                          <h6 className="fw-medium">
                            <a href="#">Harvey Smith</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>IOS Developer</td>
                    <td>Developer</td>
                    <td>18 Feb 2024</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_performance_appraisal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash"></i>
                        </a>
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
                        <a href="#" className="avatar avatar-md avatar-rounded">
                          <img
                            src="assets/img/users/user-33.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        </a>
                        <div className="ms-2">
                          <h6 className="fw-medium">
                            <a href="#">Stephan Peralt</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>Android Developer</td>
                    <td>Developer</td>
                    <td>24 Feb 2024</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_performance_appraisal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash"></i>
                        </a>
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
                        <a href="#" className="avatar avatar-md avatar-rounded">
                          <img
                            src="assets/img/users/user-34.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        </a>
                        <div className="ms-2">
                          <h6 className="fw-medium">
                            <a href="#">Doglas Martini</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>DevOps Engineer</td>
                    <td>DevOps</td>
                    <td>11 Mar 2024</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_performance_appraisal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="add_performance_appraisal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Appraisal</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
            <form action="performance-appraisal.php">
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Employee</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Anthony Lewis</option>
                        <option>Brian Villalobos</option>
                        <option>Harvey Smith</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Appraisal Date</label>
                      <div className="input-icon-end position-relative">
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <ul
                      className="nav appraisal-tab nav-pills mb-3"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link border   active"
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#technical"
                          type="button"
                          role="tab"
                          aria-selected="true"
                        >
                          Technical
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link border"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#organization"
                          type="button"
                          role="tab"
                          aria-selected="false"
                        >
                          Organizational
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-12">
                    <div
                      className="tab-content appraisal-tab-content"
                      id="pills-tabContent"
                    >
                      <div
                        className="tab-pane fade show active"
                        id="technical"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                        tabindex="0"
                      >
                        <div className="card">
                          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Technical Competencies</h5>
                          </div>
                          <div className="card-body p-0">
                            <div className="table-responsive">
                              <table className="table ">
                                <thead className="thead-light">
                                  <tr>
                                    <th>Indicator</th>
                                    <th>Expected Value</th>
                                    <th>Set Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Customer Experience</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Marketing</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Management</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Administration</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Presentation Skill</td>
                                    <td>Expert / Leader</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Quality Of Work</td>
                                    <td>Expert / Leader</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Efficiency</td>
                                    <td>Expert / Leader</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="organization"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                        tabindex="0"
                      >
                        <div className="card">
                          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Organizational Competencies</h5>
                          </div>
                          <div className="card-body p-0">
                            <div className="table-responsive">
                              <table className="table ">
                                <thead className="thead-light">
                                  <tr>
                                    <th>Indicator</th>
                                    <th>Expected Value</th>
                                    <th>Set Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Integrity</td>
                                    <td>Beginner</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Professionalism</td>
                                    <td>Beginner</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Team Work</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Critical Thinking</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Conflict Management</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Attendance</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Ability To Meet Deadline</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="edit_performance_appraisal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Appraisal</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
            <form action="performance-appraisal.php">
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Employee</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option selected>Anthony Lewis</option>
                        <option>Brian Villalobos</option>
                        <option>Harvey Smith</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Appraisal Date</label>
                      <div className="input-icon-end position-relative">
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <ul
                      className="nav appraisal-tab nav-pills mb-3"
                      id="pills-tab2"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link border   active"
                          id="pills-home-tab2"
                          data-bs-toggle="pill"
                          data-bs-target="#edit_technical"
                          type="button"
                          role="tab"
                          aria-selected="true"
                        >
                          Technical
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link border"
                          id="pills-profile-tab2"
                          data-bs-toggle="pill"
                          data-bs-target="#edit_organization"
                          type="button"
                          role="tab"
                          aria-selected="false"
                        >
                          Organizational
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-12">
                    <div
                      className="tab-content appraisal-tab-content"
                      id="pills-tabContent2"
                    >
                      <div
                        className="tab-pane fade show active"
                        id="edit_technical"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab2"
                        tabindex="0"
                      >
                        <div className="card">
                          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Technical Competencies</h5>
                          </div>
                          <div className="card-body p-0">
                            <div className="table-responsive">
                              <table className="table ">
                                <thead className="thead-light">
                                  <tr>
                                    <th>Indicator</th>
                                    <th>Expected Value</th>
                                    <th>Set Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Customer Experience</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Marketing</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Management</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Administration</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Presentation Skill</td>
                                    <td>Expert / Leader</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Quality Of Work</td>
                                    <td>Expert / Leader</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Efficiency</td>
                                    <td>Expert / Leader</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="edit_organization"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab2"
                        tabindex="0"
                      >
                        <div className="card">
                          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Organizational Competencies</h5>
                          </div>
                          <div className="card-body p-0">
                            <div className="table-responsive">
                              <table className="table ">
                                <thead className="thead-light">
                                  <tr>
                                    <th>Indicator</th>
                                    <th>Expected Value</th>
                                    <th>Set Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Integrity</td>
                                    <td>Beginner</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Professionalism</td>
                                    <td>Beginner</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Team Work</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Critical Thinking</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Conflict Management</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Attendance</td>
                                    <td>Intermediate</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Ability To Meet Deadline</td>
                                    <td>Advanced</td>
                                    <td>
                                      <select className="form-select">
                                        <option>None</option>
                                        <option> Beginner</option>
                                        <option> Intermediate</option>
                                        <option> Advanced</option>
                                        <option> Expert / Leader</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option selected>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Appraisal
                </button>
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
              <p className="mb-3">
                You want to delete all the marked items, this cant be undone
                once you delete.
              </p>
              <div className="d-flex justify-content-center">
                <a
                  href="javascript:void(0);"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </a>
                <a href="/performance-appraisal" className="btn btn-danger">
                  Yes, Delete
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceAppraisalPage;
