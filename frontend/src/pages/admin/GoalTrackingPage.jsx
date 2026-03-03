import React from "react";
import { Link } from "react-router-dom";

const GoalTrackingPage = () => {
  return (
    <>
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">Goal Tracking</h2>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    <i className="ti ti-smart-home"></i>
                  </Link>
                </li>
                <li className="breadcrumb-item">Performance</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Goal Tracking
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
            <div className="mb-2">
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#add_goal"
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="ti ti-circle-plus me-2"></i>Add Goal{" "}
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
            <h5>Goal Tracking List</h5>
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
                    <th>Goal Type</th>
                    <th>Subject</th>
                    <th>Target Achievement</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Progress</th>
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
                    <td>Development Goals</td>
                    <td>Programming Skills</td>
                    <td>Complete a HTML course</td>
                    <td>14 Jan 2024</td>
                    <td>13 Mar 2024</td>
                    <td>Improve proficiency</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <span className="fs-12 mb-1">Completed 70%</span>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Success example"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: "87px", height: "5px" }}
                      >
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_goal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
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
                    <td>Project Goals</td>
                    <td>App Development</td>
                    <td>Deliver the app</td>
                    <td>21 Jan 2024</td>
                    <td>21 Feb 2024</td>
                    <td>Complete the app</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <span className="fs-12 mb-1">Completed 40%</span>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Success example"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: "87px", height: "5px" }}
                      >
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_goal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
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
                    <td>Project Goals</td>
                    <td>Web Development</td>
                    <td>Deliver the template</td>
                    <td>18 Feb 2024</td>
                    <td>18 Mar 2024</td>
                    <td>Complete the template</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <i className="ti ti-point-filled me-1"></i>Active
                      </span>
                    </td>
                    <td>
                      <span className="fs-12 mb-1">Completed 60%</span>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Success example"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: "87px", height: "5px" }}
                      >
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <div className="action-icon d-inline-flex">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_goal"
                        >
                          <i className="ti ti-edit"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
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

      {/* Add Goal Tracking */}
      <div className="modal fade" id="add_goal">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Goal Tracking</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
            <form>
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Goal Type</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Development Goals</option>
                        <option>Project Goals</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Subject </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Target Achievement</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Start Date </label>
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
                    <div className="mb-3">
                      <label className="form-label">End Date </label>
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
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea className="form-control"></textarea>
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
                  Add Goal Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Indicator */}
      <div className="modal fade" id="edit_goal">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Goal Tracking</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
            <form>
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Goal Type</label>
                      <select
                        className="form-select"
                        defaultValue="Development Goals"
                      >
                        <option>Select</option>
                        <option value="Development Goals">
                          Development Goals
                        </option>
                        <option value="Project Goals">Project Goals</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Subject </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Programming Skills"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Target Achievement</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Complete a HTML course "
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Start Date </label>
                      <div className="input-icon-end position-relative">
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue="14 Jan 2024"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">End Date </label>
                      <div className="input-icon-end position-relative">
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue="13 Mar 2024"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        defaultValue="Improve proficiency"
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select" defaultValue="Active">
                        <option>Select</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
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
                <Link to="/goal-tracking" className="btn btn-danger">
                  Yes, Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalTrackingPage;
