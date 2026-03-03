import React from "react";
import { Link } from "react-router-dom";

const ScheduleTimingPage = () => {
  return (
    <>
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">Schedule Timing</h2>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    <i className="ti ti-smart-home"></i>
                  </Link>
                </li>
                <li className="breadcrumb-item">Administration</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Schedule Timing
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="mb-2">
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-file-export me-1"></i>Export
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-xls me-1"></i>Export as
                      Excel{" "}
                    </a>
                  </li>
                </ul>
              </div>
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
            <h5>Schedule Timing List</h5>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="me-3">
                <div className="input-icon-end position-relative">
                  <input
                    type="text"
                    className="form-control date-range bookingrange"
                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-chevron-down"></i>
                  </span>
                </div>
              </div>
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
                    <th>Job Title</th>
                    <th>User Available Timings</th>
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
                        <a
                          href="#"
                          className="avatar avatar-md border avatar-rounded"
                        >
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
                    <td>Accountant</td>
                    <td>
                      <div>
                        <p className="mb-0">11-03-2020 - 11:00 AM-12:00 PM</p>
                        <p className="mb-0">12-03-2020 - 10:00 AM-11:00 AM</p>
                        <p className="mb-0">01-01-1970 - 10:00 AM-11:00 AM</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#schedule_timing"
                          className="btn btn-dark"
                        >
                          Schedule Timing
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
                        <a
                          href="#"
                          className="avatar avatar-md border avatar-rounded"
                        >
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
                    <td>Accountant</td>
                    <td>
                      <div>
                        <p className="mb-0">11-03-2020 - 11:00 AM-12:00 PM</p>
                        <p className="mb-0">12-03-2020 - 10:00 AM-11:00 AM</p>
                        <p className="mb-0">01-01-1970 - 10:00 AM-11:00 AM</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#schedule_timing"
                          className="btn btn-dark"
                        >
                          Schedule Timing
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
                        <a
                          href="#"
                          className="avatar avatar-md border avatar-rounded"
                        >
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
                    <td>Accountant</td>
                    <td>
                      <div>
                        <p className="mb-0">11-03-2020 - 11:00 AM-12:00 PM</p>
                        <p className="mb-0">12-03-2020 - 10:00 AM-11:00 AM</p>
                        <p className="mb-0">01-01-1970 - 10:00 AM-11:00 AM</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#schedule_timing"
                          className="btn btn-dark"
                        >
                          Schedule Timing
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

      <div
        id="schedule_timing"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Schedule</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option defaultValue="">Select</option>
                        <option defaultValue="">Development</option>
                        <option defaultValue="1">Finance</option>
                        <option defaultValue="2">Finance and Management</option>
                        <option defaultValue="3">Hr & Finance</option>
                        <option defaultValue="4">ITech</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Employee Name <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option defaultValue="">Select </option>
                        <option defaultValue="1">Richard Miles </option>
                        <option defaultValue="2">John Smith</option>
                        <option defaultValue="3">Mike Litorus </option>
                        <option defaultValue="4">Wilmer Deluna</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Date</label>
                      <div className="cal-icon">
                        <input
                          className="form-control datetimepicker"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Shifts <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option defaultValue="">Select </option>
                        <option defaultValue="1">10'o clock Shift</option>
                        <option defaultValue="2">10:30 shift</option>
                        <option defaultValue="3">Daily Shift </option>
                        <option defaultValue="4">New Shift</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Min Start Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group time">
                        <input className="form-control timepicker" />
                        <span className="input-group-text">
                          <i className="fa-regular fa-clock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Start Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group time">
                        <input className="form-control timepicker" />
                        <span className="input-group-text">
                          <i className="fa-regular fa-clock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Max Start Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group time">
                        <input className="form-control timepicker" />
                        <span className="input-group-text">
                          <i className="fa-regular fa-clock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Min End Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group time">
                        <input className="form-control timepicker" />
                        <span className="input-group-text">
                          <i className="fa-regular fa-clock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        End Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group time">
                        <input className="form-control timepicker" />
                        <span className="input-group-text">
                          <i className="fa-regular fa-clock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Max End Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group time">
                        <input className="form-control timepicker" />
                        <span className="input-group-text">
                          <i className="fa-regular fa-clock"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Break Time <span className="text-danger">*</span>
                      </label>
                      <input className="form-control timepicker" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Accept Extra Hours{" "}
                      </label>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customSwitch1"
                          checked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customSwitch1"
                        ></label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Publish </label>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customSwitch2"
                          checked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customSwitch2"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleTimingPage;
