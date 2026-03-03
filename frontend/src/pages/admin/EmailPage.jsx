import React from "react";

const EmailPage = () => {
  return (
    <>
      <div className="content p-0">
        <div className="d-md-flex">
          <div className="email-sidebar border-end border-bottom">
            <div className="active slimscroll h-100">
              <div className="slimscroll-active-sidebar">
                <div className="p-3">
                  <div className="shadow-md bg-white rounded p-2 mb-4">
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="avatar avatar-md flex-shrink-0 me-2"
                      >
                        <img
                          src="assets/img/profiles/avatar-02.jpg"
                          className="rounded-circle"
                          alt="Img"
                        />
                      </a>
                      <div>
                        <h6 className="mb-1">
                          <a href="javascript:void(0);">James Hong</a>
                        </h6>
                        <p>
                          <a
                            href="cdn-cgi/l/email-protection"
                            className="__cf_email__"
                            data-cfemail="1b517573282f285b7e637a766b777e35787476"
                          >
                            [email&#160;protected]
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    href="javascript:void(0);"
                    className="btn btn-primary w-100"
                    id="compose_mail"
                  >
                    <i className="ti ti-edit me-2"></i>Compose
                  </a>
                  <div className="mt-4">
                    <h5 className="mb-2">Emails</h5>
                    <div className="d-block mb-4 pb-4 border-bottom email-tags">
                      <a
                        href="email.php"
                        className="d-flex align-items-center justify-content-between p-2 rounded active"
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className="ti ti-inbox text-gray me-2"></i>Inbox
                        </span>
                        <span className="badge badge-danger rounded-pill badge-xs">
                          56
                        </span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className="ti ti-star text-gray me-2"></i>Starred
                        </span>
                        <span className="fw-semibold fs-12 badge text-gray rounded-pill">
                          46
                        </span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className="ti ti-rocket text-gray me-2"></i>Sent
                        </span>
                        <span className="badge text-gray rounded-pill">14</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className="ti ti-file text-gray me-2"></i>Drafts
                        </span>
                        <span className="badge text-gray rounded-pill">12</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className="ti ti-trash text-gray me-2"></i>Deleted
                        </span>
                        <span className="badge text-gray rounded-pill">08</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className="ti ti-info-octagon text-gray me-2"></i>
                          Spam
                        </span>
                        <span className="badge text-gray rounded-pill">0</span>
                      </a>
                      <div>
                        <div className="more-menu">
                          <a
                            href="javascript:void(0);"
                            className="d-flex align-items-center justify-content-between p-2 rounded"
                          >
                            <span className="d-flex align-items-center fw-medium">
                              <i className="ti ti-location-up text-gray me-2"></i>
                              Important
                            </span>
                            <span className="badge text-gray rounded-pill">
                              12
                            </span>
                          </a>
                          <a
                            href="javascript:void(0);"
                            className="d-flex align-items-center justify-content-between p-2 rounded"
                          >
                            <span className="d-flex align-items-center fw-medium">
                              <i className="ti ti-transition-top text-gray me-2"></i>
                              All Emails
                            </span>
                            <span className="badge text-gray rounded-pill">
                              34
                            </span>
                          </a>
                        </div>
                        <div className="view-all mt-2">
                          <a
                            href="javascript:void(0);"
                            className="viewall-button fw-medium"
                          >
                            <span>Show More</span>
                            <i className="fa fa-chevron-down fs-10 ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-bottom mb-4 pb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h5>Labels</h5>
                      <a href="javascript:void(0);">
                        <i className="ti ti-square-rounded-plus-filled text-primary fs-16"></i>
                      </a>
                    </div>
                    <div>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-square-rounded text-success me-2"></i>
                        Team Events
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-square-rounded text-warning me-2"></i>
                        Work
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-square-rounded text-danger me-2"></i>
                        External
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-square-rounded text-skyblue me-2"></i>
                        Projects
                      </a>
                      <div>
                        <div className="more-menu-2">
                          <a
                            href="javascript:void(0);"
                            className="fw-medium d-flex align-items-center text-dark py-1"
                          >
                            <i className="ti ti-square-rounded text-purple me-2"></i>
                            Applications
                          </a>
                          <a
                            href="javascript:void(0);"
                            className="fw-medium d-flex align-items-center text-dark py-1"
                          >
                            <i className="ti ti-square-rounded text-info me-2"></i>
                            Desgin
                          </a>
                        </div>
                        <div className="view-all mt-2">
                          <a
                            href="javascript:void(0);"
                            className="viewall-button-2 fw-medium"
                          >
                            <span>Show More</span>
                            <i className="fa fa-chevron-down fs-10 ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-bottom mb-4 pb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h5>Folders</h5>
                      <a href="javascript:void(0);">
                        <i className="ti ti-square-rounded-plus-filled text-primary fs-16"></i>
                      </a>
                    </div>
                    <div>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-folder-filled text-danger me-2"></i>
                        Projects
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-folder-filled text-warning me-2"></i>
                        Personal
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="fw-medium d-flex align-items-center text-dark py-1"
                      >
                        <i className="ti ti-folder-filled text-success me-2"></i>
                        Finance
                      </a>
                      <div>
                        <div className="more-menu-3">
                          <a
                            href="javascript:void(0);"
                            className="fw-medium d-flex align-items-center text-dark py-1"
                          >
                            <i className="ti ti-folder-filled text-info me-2"></i>
                            Projects
                          </a>
                          <a
                            href="javascript:void(0);"
                            className="fw-medium d-flex align-items-center text-dark py-1"
                          >
                            <i className="ti ti-folder-filled text-primary me-2"></i>
                            Personal
                          </a>
                        </div>
                        <div className="view-all mt-2">
                          <a
                            href="javascript:void(0);"
                            className="viewall-button-3 fw-medium"
                          >
                            <span>Show More</span>
                            <i className="fa fa-chevron-down fs-10 ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark rounded text-center position-relative p-4">
                    <span className="avatar avatar-lg rounded-circle bg-white mb-2">
                      <i className="ti ti-alert-triangle text-dark"></i>
                    </span>
                    <h6 className="text-white mb-3">
                      Enjoy Unlimited Access on a small price monthly.
                    </h6>
                    <a href="javascript:void(0);" className="btn btn-white">
                      Upgrade Now <i className="ti ti-arrow-right"></i>
                    </a>
                    <div className="box-bg">
                      <span className="bg-right">
                        <img src="assets/img/bg/email-bg-01.png" alt="Img" />
                      </span>
                      <span className="bg-left">
                        <img src="assets/img/bg/email-bg-02.png" alt="Img" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white flex-fill border-end border-bottom mail-notifications">
            <div className="active slimscroll h-100">
              <div className="slimscroll-active-sidebar">
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <div>
                      <h5 className="mb-1">Inbox</h5>
                      <div className="d-flex align-items-center">
                        <span>2345 Emails</span>
                        <i className="ti ti-point-filled text-primary mx-1"></i>
                        <span>56 Unread</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="position-relative input-icon me-3">
                        <span className="input-icon-addon">
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Email"
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <a
                          href="javascript:void(0);"
                          className="btn btn-icon btn-sm rounded-circle"
                        >
                          <i className="ti ti-filter-edit"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-icon btn-sm rounded-circle"
                        >
                          <i className="ti ti-settings"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-icon btn-sm rounded-circle"
                        >
                          <i className="ti ti-refresh"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group list-group-flush mails-list">
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar bg-purple avatar-rounded me-2"
                        >
                          <span className="avatar-title">CD</span>
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Justin Lapointe</a>
                              </h6>
                              <span className="fw-semibold">
                                Client Dashboard
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-success"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>It seems that recipients are receiving...</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark me-2">
                          <i className="ti ti-folder-open me-2"></i>3
                        </span>
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark">
                          <i className="ti ti-photo me-2"></i>+24
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span>
                          <i className="ti ti-star-filled text-warning"></i>
                        </span>
                        <span className="badge badge-soft-info mx-2">
                          <i className="ti ti-square me-1"></i>Projects
                        </span>
                        <a
                          href="javascript:void(0);"
                          className="badge badge-dark rounded-pill badge-xs"
                        >
                          +1
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar avatar-md avatar-rounded me-2"
                        >
                          <img
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="Img"
                          />
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Rufana</a>
                              </h6>
                              <span className="fw-semibold">UI project</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>Regardless, you can usually expect an increase</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <a href="javascript:void(0);">
                        <img src="assets/img/icons/google-meet.svg" alt="Img" />
                      </a>
                      <div className="d-flex align-items-center">
                        <span>
                          <i className="ti ti-star-filled text-warning"></i>
                        </span>
                        <span className="badge badge-soft-purple mx-2">
                          <i className="ti ti-square me-1"></i>Applications
                        </span>
                        <a
                          href="javascript:void(0);"
                          className="badge badge-dark rounded-pill badge-xs"
                        >
                          +1
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar avatar-md avatar-rounded me-2"
                        >
                          <img
                            src="assets/img/profiles/avatar-03.jpg"
                            alt="Img"
                          />
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Cameron Drake</a>
                              </h6>
                              <span className="fw-semibold">
                                You’re missing
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>
                            Here are a few catchy email subject line examples 
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark fs-14">
                          <i className="ti ti-video me-2"></i>1
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span>
                          <i className="ti ti-star-filled text-warning"></i>
                        </span>
                        <span className="badge badge-soft-danger mx-2">
                          <i className="ti ti-square me-1"></i>External
                        </span>
                        <a
                          href="javascript:void(0);"
                          className="badge badge-dark rounded-pill badge-xs"
                        >
                          +1
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar avatar-md avatar-rounded me-2"
                        >
                          <img
                            src="assets/img/profiles/avatar-04.jpg"
                            alt="Img"
                          />
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Sean Hill</a>
                              </h6>
                              <span className="fw-semibold">
                                How Have You Progressed
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>You can write effective retargeting subject</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark">
                          <i className="ti ti-photo me-2"></i>1
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="badge badge-soft-success">
                          <i className="ti ti-square me-1"></i>Team Events
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar avatar-md avatar-rounded me-2"
                        >
                          <img
                            src="assets/img/profiles/avatar-05.jpg"
                            alt="Img"
                          />
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Kevin Alley</a>
                              </h6>
                              <span className="fw-semibold">
                                Flash. Sale. Alert.
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>You can also use casual language,</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark">
                          <i className="ti ti-link me-2"></i>1
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="badge badge-soft-danger me-2">
                          <i className="ti ti-square me-1"></i>External
                        </span>
                        <a
                          href="javascript:void(0);"
                          className="badge badge-dark rounded-pill badge-xs"
                        >
                          +1
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar avatar-md avatar-rounded me-2"
                        >
                          <img
                            src="assets/img/profiles/avatar-08.jpg"
                            alt="Img"
                          />
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Linda Zimmer</a>
                              </h6>
                              <span className="fw-semibold">
                                Products the celebs are
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>It seems that recipients are receiving...</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark">
                          <i className="ti ti-link me-2"></i>1
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="badge badge-soft-warning me-2">
                          <i className="ti ti-square me-1"></i>Work
                        </span>
                        <a
                          href="javascript:void(0);"
                          className="badge badge-dark rounded-pill badge-xs"
                        >
                          +1
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-bottom p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar bg-success avatar-rounded me-2"
                        >
                          <span className="avatar-title">ER</span>
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Emly Reachel</a>
                              </h6>
                              <span className="fw-semibold">No Subject</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>Announcing Fake Name Generator Premium</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark">
                          <i className="ti ti-folder-open me-2"></i>3
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="badge badge-soft-info">
                          <i className="ti ti-square me-1"></i>Projects
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                        <a
                          href="email-reply.php"
                          className="avatar avatar-md avatar-rounded me-2"
                        >
                          <img
                            src="assets/img/profiles/avatar-07.jpg"
                            alt="Img"
                          />
                        </a>
                        <div className="flex-fill">
                          <div className="d-flex align-items-start justify-content-between">
                            <div>
                              <h6 className="mb-1">
                                <a href="email-reply.php">Sean Hill</a>
                              </h6>
                              <span className="fw-semibold">
                                You’re missing
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-icon btn-sm rounded-circle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="email-reply.php"
                                    >
                                      Open Email
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Reply All
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Forward As Attachment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mark As Unread
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move to Junk
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Mute
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Delete
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="javascript:void(0);"
                                    >
                                      Move To
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <i className="ti ti-point-filled text-danger"></i>
                                3:13 PM
                              </span>
                            </div>
                          </div>
                          <p>Regardless, you can usually expect an increase</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark me-2">
                          <i className="ti ti-folder-open me-2"></i>3
                        </span>
                        <span className="d-flex align-items-center btn btn-sm bg-transparent-dark">
                          <i className="ti ti-photo me-2"></i>+24
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span>
                          <i className="ti ti-star-filled text-warning"></i>
                        </span>
                        <span className="badge badge-soft-info mx-2">
                          <i className="ti ti-square me-1"></i>Applications
                        </span>
                        <a
                          href="javascript:void(0);"
                          className="badge badge-dark rounded-pill badge-xs"
                        >
                          +1
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="compose-view">
        <div className="bg-white border-0 rounded compose-view">
          <div className="compose-header d-flex align-items-center justify-content-between bg-dark p-3">
            <h5 className="text-white">Compose New Email</h5>
            <div className="d-flex align-items-center">
              <a
                href="javascript:void(0);"
                className="d-inline-flex me-2 text-white fs-16"
              >
                <i className="ti ti-minus"></i>
              </a>
              <a
                href="javascript:void(0);"
                className="d-inline-flex me-2 fs-16 text-white"
              >
                <i className="ti ti-maximize"></i>
              </a>
              <button
                type="button"
                className="btn-close custom-btn-close bg-transparent fs-16 text-white position-static"
                id="compose-close"
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
          </div>
          <form action="email.php">
            <div className="p-3 position-relative pb-2 border-bottom">
              <div className="tag-with-img d-flex align-items-center">
                <label className="form-label me-2">To</label>
                <input
                  className="input-tags form-control border-0 h-100"
                  id="inputBox"
                  type="text"
                  data-role="tagsinput"
                  name="Label"
                  value="Angela Thomas"
                />
              </div>
              <div className="d-flex align-items-center email-cc">
                <a href="javascript:void(0);" className="d-inline-flex me-2">
                  Cc
                </a>
                <a href="javascript:void(0);" className="d-inline-flex">
                  Bcc
                </a>
              </div>
            </div>
            <div className="p-3 border-bottom">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                />
              </div>
              <div className="mb-0">
                <textarea
                  rows="7"
                  className="form-control"
                  placeholder="Compose Email"
                ></textarea>
              </div>
            </div>
            <div className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-paperclip"></i>
                </a>
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-photo"></i>
                </a>
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-link"></i>
                </a>
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-pencil"></i>
                </a>
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-mood-smile"></i>
                </a>
              </div>
              <div className="d-flex align-items-center compose-footer">
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-calendar-repeat"></i>
                </a>
                <a
                  href="javascript:void(0);"
                  className="btn btn-icon btn-sm rounded-circle"
                >
                  <i className="ti ti-trash"></i>
                </a>
                <button
                  type="submit"
                  className="btn btn-primary d-inline-flex align-items-center ms-2"
                >
                  Send <i className="ti ti-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailPage;
