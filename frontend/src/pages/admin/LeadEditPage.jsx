import { useEffect, useState } from 'react'
import { loadLegacyUiScripts } from '../../utils/loadLegacyUiScripts'

function AdminDashboardPage() {
  const [showTodoModal, setShowTodoModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showLeavesModal, setShowLeavesModal] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [activeTab, setActiveTab] = useState('applicants')
  useEffect(() => {
    let timer = null
    loadLegacyUiScripts([
      '/assets/js/jquery-3.7.1.min.js',
      '/assets/js/bootstrap.bundle.min.js',
      '/assets/js/feather.min.js',
      '/assets/js/jquery.slimscroll.min.js',
      '/assets/plugins/apexchart/apexcharts.min.js',
      '/assets/plugins/apexchart/chart-data.js',
      '/assets/plugins/chartjs/chart.min.js',
      '/assets/plugins/chartjs/chart-data.js',
      '/assets/js/bootstrap-datetimepicker.min.js',
      '/assets/js/script.js',
      '/assets/js/todo.js',
    ])
      .then(() => {
        timer = window.setTimeout(() => {
          if (typeof window.__nexorAdminDashboardInit === 'function') {
            window.__nexorAdminDashboardInit()
          }

          window.dispatchEvent(new Event('load'))
          document.dispatchEvent(new Event('DOMContentLoaded'))

          if (window.$) {
            window.$(document).trigger('ready')
          }
        }, 500)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Admin dashboard script load error:', err)
      })

    return () => {
      if (timer) window.clearTimeout(timer)
      if (typeof window.__nexorAdminDashboardDestroy === 'function') {
        window.__nexorAdminDashboardDestroy()
      }
    }
  }, [])

  return (
    <div className="content">

      {/* Breadcrumb */}
      <div className="content">
        <div className="content">
          <h2 className="content">Admin Dashboard</h2>
          <nav>
            <ol className="content">
              <li className="content">
                <a href="#"><i className="content"></i></a>
              </li>
              <li className="content">Dashboard</li>
              <li className="content" aria-current="page">Admin Dashboard</li>
            </ol>
          </nav>
        </div>
        <div className="content">
          <div className="content">
            <div className="content">
              <a href="#" className="content" data-bs-toggle="dropdown">
                <i className="content"></i>Export
              </a>
              <ul className="content">
                <li><a href="#" className="content"><i className="content"></i>Export as PDF</a></li>
                <li><a href="#" className="content"><i className="content"></i>Export as Excel</a></li>
              </ul>
            </div>
          </div>
          <div className="content">
            <div className="content">
              <span className="content">
                <i className="content"></i>
              </span>
              <input type="text" className="content" defaultValue="2025" />
            </div>
          </div>
          <div className="content">
            <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
              <i className="content"></i>
            </a>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Welcome Wrap */}
      <div className="content">
        <div className="content">
          <div className="content">
            <span className="content">
              <img src="/assets/img/profiles/avatar-31.jpg" className="content" alt="img" />
            </span>
            <div className="content">
              <h3 className="content">Welcome Back, Adrian <a href="#" className="content"><i className="content"></i></a></h3>
              <p>You have <span className="content">21</span> Pending Approvals &amp; <span className="content">14</span> Leave Requests</p>
            </div>
          </div>
          <div className="content">
            <a href="#" className="content" onClick={(e) => { e.preventDefault(); setShowProjectModal(true); setWizardStep(1); }}>
              <i className="content"></i>Add Project
            </a>
            <a href="#" className="content" onClick={(e) => { e.preventDefault(); setShowLeavesModal(true); }}>
              <i className="content"></i>Add Requests
            </a>
          </div>
        </div>
      </div>
      {/* /Welcome Wrap */}

      <div className="content">
        {/* Widget Info */}
        <div className="content">
          <div className="content">
            {[
              { bg: 'bg-primary', icon: 'ti-calendar-share', label: 'Attendance Overview', value: '120/154', delta: '+2.1%', up: true, link: 'attendance-employee.php', linkLabel: 'View Details' },
              { bg: 'bg-secondary', icon: 'ti-browser', label: "Total No of Project's", value: '90/125', delta: '-2.1%', up: false, link: 'projects.php', linkLabel: 'View All' },
              { bg: 'bg-info', icon: 'ti-users-group', label: 'Total No of Clients', value: '69/86', delta: '-11.2%', up: false, link: 'clients.php', linkLabel: 'View All' },
              { bg: 'bg-pink', icon: 'ti-checklist', label: 'Total No of Tasks', value: '225/28', delta: '+11.2%', up: true, link: 'tasks.php', linkLabel: 'View All' },
              { bg: 'bg-purple', icon: 'ti-moneybag', label: 'Earnings', value: '$21445', delta: '+10.2%', up: true, link: 'expenses.php', linkLabel: 'View All' },
              { bg: 'bg-danger', icon: 'ti-browser', label: 'Profit This Week', value: '$5,544', delta: '+2.1%', up: true, link: 'purchase-transaction.php', linkLabel: 'View All' },
              { bg: 'bg-success', icon: 'ti-users-group', label: 'Job Applicants', value: '98', delta: '+2.1%', up: true, link: 'job-list.php', linkLabel: 'View All' },
              { bg: 'bg-dark', icon: 'ti-user-star', label: 'New Hire', value: '45/48', delta: '-11.2%', up: false, link: 'candidates.php', linkLabel: 'View All' },
            ].map((w, i) => (
              <div className="content" key={i}>
                <div className="content">
                  <div className="content">
                    <span className={`avatar rounded-circle ${w.bg} mb-2`}>
                      <i className={`ti ${w.icon} fs-16`}></i>
                    </span>
                    <h6 className="content">{w.label}</h6>
                    <h3 className="content">
                      {w.value}{' '}
                      <span className={`fs-12 fw-medium ${w.up ? 'text-success' : 'text-danger'}`}>
                        <i className={`fa-solid ${w.up ? 'fa-caret-up' : 'fa-caret-down'} me-1`}></i>{w.delta}
                      </span>
                    </h3>
                    <a href="#" className="content">{w.linkLabel}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* /Widget Info */}

        {/* Employees By Department */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Employees By Department</h5>
              <div className="content">
                <a href="#" className="content" data-bs-toggle="dropdown">
                  <i className="content"></i>This Week
                </a>
                <ul className="content">
                  <li><a href="#" className="content">This Month</a></li>
                  <li><a href="#" className="content">This Week</a></li>
                  <li><a href="#" className="content">Last Week</a></li>
                </ul>
              </div>
            </div>
            <div className="content">
              <div id="emp-department">{/* Chart initialized by legacy JS */}</div>
              <p className="content"><i className="content"></i>No of Employees increased by <span className="content">+20%</span> from last Week</p>
            </div>
          </div>
        </div>
        {/* /Employees By Department */}
      </div>

      <div className="content">
        {/* Employee Status */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Employee Status</h5>
              <div className="content">
                <a href="#" className="content" data-bs-toggle="dropdown">
                  <i className="content"></i>This Week
                </a>
                <ul className="content">
                  <li><a href="#" className="content">This Month</a></li>
                  <li><a href="#" className="content">This Week</a></li>
                  <li><a href="#" className="content">Today</a></li>
                </ul>
              </div>
            </div>
            <div className="content">
              <div className="content">
                <p className="content">Total Employee</p>
                <h3 className="content">154</h3>
              </div>
              <div className="content">
                <div className="content" role="progressbar" style={{ width: '40%' }}><div className="content"></div></div>
                <div className="content" role="progressbar" style={{ width: '20%' }}><div className="content"></div></div>
                <div className="content" role="progressbar" style={{ width: '10%' }}><div className="content"></div></div>
                <div className="content" role="progressbar" style={{ width: '30%' }}><div className="content"></div></div>
              </div>
              <div className="content">
                <div className="content">
                  <div className="content">
                    <div className="content">
                      <p className="content"><i className="content"></i>Fulltime <span className="content">(48%)</span></p>
                      <h2 className="content">112</h2>
                    </div>
                  </div>
                  <div className="content">
                    <div className="content">
                      <p className="content"><i className="content"></i>Contract <span className="content">(20%)</span></p>
                      <h2 className="content">112</h2>
                    </div>
                  </div>
                  <div className="content">
                    <div className="content">
                      <p className="content"><i className="content"></i>Probation <span className="content">(22%)</span></p>
                      <h2 className="content">12</h2>
                    </div>
                  </div>
                  <div className="content">
                    <div className="content">
                      <p className="content"><i className="content"></i>WFH <span className="content">(20%)</span></p>
                      <h2 className="content">04</h2>
                    </div>
                  </div>
                </div>
              </div>
              <h6 className="content">Top Performer</h6>
              <div className="content">
                <div className="content">
                  <span className="content"><i className="content"></i></span>
                  <a href="#" className="content">
                    <img src="/assets/img/profiles/avatar-24.jpg" className="content" alt="img" />
                  </a>
                  <div>
                    <h6 className="content"><a href="#">Daniel Esbella</a></h6>
                    <p className="content">IOS Developer</p>
                  </div>
                </div>
                <div className="content">
                  <p className="content">Performance</p>
                  <h5 className="content">99%</h5>
                </div>
              </div>
              <a href="#" className="content">View All Employees</a>
            </div>
          </div>
        </div>
        {/* /Employee Status */}

        {/* Attendance Overview */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Attendance Overview</h5>
              <div className="content">
                <a href="#" className="content" data-bs-toggle="dropdown">
                  <i className="content"></i>Today
                </a>
                <ul className="content">
                  <li><a href="#" className="content">This Month</a></li>
                  <li><a href="#" className="content">This Week</a></li>
                  <li><a href="#" className="content">Today</a></li>
                </ul>
              </div>
            </div>
            <div className="content">
              <div className="content">
                <canvas id="attendance" height="200"></canvas>
                <div className="content">
                  <p className="content">Total Attendance</p>
                  <h3>120</h3>
                </div>
              </div>
              <h6 className="content">Status</h6>
              {[
                { color: 'text-success', label: 'Present', val: '59%' },
                { color: 'text-secondary', label: 'Late', val: '21%' },
                { color: 'text-warning', label: 'Permission', val: '2%' },
                { color: 'text-danger', label: 'Absent', val: '15%' },
              ].map((s, i) => (
                <div className="content" key={i}>
                  <p className="content"><i className={`ti ti-circle-filled ${s.color} me-1`}></i>{s.label}</p>
                  <p className="content">{s.val}</p>
                </div>
              ))}
              <div className="content">
                <div className="content">
                  <p className="content">Total Absenties</p>
                  <div className="content">
                    {['avatar-27','avatar-30','avatar-14','avatar-29'].map((a,i) => (
                      <span className="content" key={i}>
                        <img className="content" src={`assets/img/profiles/${a}.jpg`} alt="img" />
                      </span>
                    ))}
                    <a className="content" href="#">+1</a>
                  </div>
                </div>
                <a href="#" className="content">View Details</a>
              </div>
            </div>
          </div>
        </div>
        {/* /Attendance Overview */}

        {/* Clock-In/Out */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Clock-In/Out</h5>
              <div className="content">
                <div className="content">
                  <a href="#" className="content" data-bs-toggle="dropdown">All Departments</a>
                  <ul className="content">
                    <li><a href="#" className="content">Finance</a></li>
                    <li><a href="#" className="content">Development</a></li>
                    <li><a href="#" className="content">Marketing</a></li>
                  </ul>
                </div>
                <div className="content">
                  <a href="#" className="content" data-bs-toggle="dropdown">
                    <i className="content"></i>Today
                  </a>
                  <ul className="content">
                    <li><a href="#" className="content">This Month</a></li>
                    <li><a href="#" className="content">This Week</a></li>
                    <li><a href="#" className="content">Today</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="content">
              {/* Clock in rows */}
              {[
                { img: 'avatar-24', name: 'Daniel Esbella', role: 'UI/UX Designer', time: '09:15', border: 'border-dashed' },
                { img: 'avatar-23', name: 'Doglas Martini', role: 'Project Manager', time: '09:36', border: '' },
              ].map((e, i) => (
                <div className={`d-flex align-items-center justify-content-between mb-3 p-2 border ${e.border} br-5`} key={i}>
                  <div className="content">
                    <a href="#" className="content">
                      <img src={`assets/img/profiles/${e.img}.jpg`} className="content" alt="img" />
                    </a>
                    <div className="content">
                      <h6 className="content">{e.name}</h6>
                      <p className="content">{e.role}</p>
                    </div>
                  </div>
                  <div className="content">
                    <a href="#" className="content"><i className="content"></i></a>
                    <span className="content"><i className="content"></i>{e.time}</span>
                  </div>
                </div>
              ))}
              {/* Brian with clock detail */}
              <div className="content">
                <div className="content">
                  <div className="content">
                    <a href="#" className="content">
                      <img src="/assets/img/profiles/avatar-27.jpg" className="content" alt="img" />
                    </a>
                    <div className="content">
                      <h6 className="content">Brian Villalobos</h6>
                      <p className="content">PHP Developer</p>
                    </div>
                  </div>
                  <div className="content">
                    <a href="#" className="content"><i className="content"></i></a>
                    <span className="content"><i className="content"></i>09:15</span>
                  </div>
                </div>
                <div className="content">
                  <div><p className="content"><i className="content"></i>Clock In</p><h6 className="content">10:30 AM</h6></div>
                  <div><p className="content"><i className="content"></i>Clock Out</p><h6 className="content">09:45 AM</h6></div>
                  <div><p className="content"><i className="content"></i>Production</p><h6 className="content">09:21 Hrs</h6></div>
                </div>
              </div>
              <h6 className="content">Late</h6>
              <div className="content">
                <div className="content">
                  <span className="content">
                    <img src="/assets/img/profiles/avatar-29.jpg" className="content" alt="img" />
                  </span>
                  <div className="content">
                    <h6 className="content">Anthony Lewis <span className="content"><i className="content"></i>30 Min</span></h6>
                    <p className="content">Marketing Head</p>
                  </div>
                </div>
                <div className="content">
                  <a href="#" className="content"><i className="content"></i></a>
                  <span className="content"><i className="content"></i>08:35</span>
                </div>
              </div>
              <a href="#" className="content">View All Attendance</a>
            </div>
          </div>
        </div>
        {/* /Clock-In/Out */}
      </div>

      <div className="content">
        {/* Jobs Applicants */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Jobs Applicants</h5>
              <a href="#" className="content">View All</a>
            </div>
            <div className="content">
              <ul className="content" role="tablist">
                <li className="content" role="presentation">
                  <a className={`nav-link fw-medium ${activeTab === 'openings' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('openings'); }}>Openings</a>
                </li>
                <li className="content" role="presentation">
                  <a className={`nav-link fw-medium ${activeTab === 'applicants' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('applicants'); }}>Applicants</a>
                </li>
              </ul>
              <div className="content">
                {activeTab === 'openings' && (
                  <div className="content">
                    {[
                      { icon: 'apple.svg', title: 'Senior IOS Developer', count: 25 },
                      { icon: 'php.svg', title: 'Junior PHP Developer', count: 20 },
                      { icon: 'react.svg', title: 'Junior React Developer', count: 30 },
                      { icon: 'laravel-icon.svg', title: 'Senior Laravel Developer', count: 40 },
                    ].map((o, i) => (
                      <div className="content" key={i}>
                        <div className="content">
                          <a href="#" className="content">
                            <img src={`assets/img/icons/${o.icon}`} className="content" alt="img" />
                          </a>
                          <div className="content">
                            <p className="content"><a href="#">{o.title}</a></p>
                            <span className="content">No of Openings : {o.count}</span>
                          </div>
                        </div>
                        <a href="#" className="content"><i className="content"></i></a>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'applicants' && (
                  <div className="content">
                    {[
                      { img: 'user-09.jpg', name: 'Brian Villalobos', exp: '5+', badge: 'badge-secondary', role: 'UI/UX Designer' },
                      { img: 'user-32.jpg', name: 'Anthony Lewis', exp: '4+', badge: 'badge-info', role: 'Python Developer' },
                      { img: 'user-32.jpg', name: 'Stephan Peralt', exp: '6+', badge: 'badge-pink', role: 'Android Developer' },
                      { img: 'user-34.jpg', name: 'Doglas Martini', exp: '2+', badge: 'badge-purple', role: 'React Developer' },
                    ].map((a, i) => (
                      <div className={`d-flex align-items-center justify-content-between ${i < 3 ? 'mb-4' : 'mb-0'}`} key={i}>
                        <div className="content">
                          <a href="#" className="content">
                            <img src={`assets/img/users/${a.img}`} className="content" alt="img" />
                          </a>
                          <div className="content">
                            <p className="content"><a href="#">{a.name}</a></p>
                            <span className="content">Exp : {a.exp}+ Years<i className="content"></i>USA</span>
                          </div>
                        </div>
                        <span className={`badge ${a.badge} badge-xs`}>{a.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* /Jobs Applicants */}

        {/* Employees Table */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Employees</h5>
              <a href="#" className="content">View All</a>
            </div>
            <div className="content">
              <div className="content">
                <table className="content">
                  <thead>
                    <tr><th>Name</th><th>Department</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { img: 'user-32.jpg', name: 'Anthony Lewis', role: 'Finance', dept: 'Finance', badge: 'badge-secondary-transparent' },
                      { img: 'user-09.jpg', name: 'Brian Villalobos', role: 'PHP Developer', dept: 'Development', badge: 'badge-danger-transparent' },
                      { img: 'user-01.jpg', name: 'Stephan Peralt', role: 'Executive', dept: 'Marketing', badge: 'badge-info-transparent' },
                      { img: 'user-34.jpg', name: 'Doglas Martini', role: 'Project Manager', dept: 'Manager', badge: 'badge-purple-transparent' },
                      { img: 'user-37.jpg', name: 'Anthony Lewis', role: 'UI/UX Designer', dept: 'UI/UX Design', badge: 'badge-pink-transparent' },
                    ].map((e, i) => (
                      <tr key={i}>
                        <td className={i === 4 ? 'border-0' : ''}>
                          <div className="content">
                            <a href="#" className="content">
                              <img src={`assets/img/users/${e.img}`} className="content" alt="img" />
                            </a>
                            <div className="content">
                              <h6 className="content"><a href="#">{e.name}</a></h6>
                              <span className="content">{e.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className={i === 4 ? 'border-0' : ''}>
                          <span className={`badge ${e.badge} badge-xs`}>{e.dept}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* /Employees */}

        {/* Todo */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Todo</h5>
              <div className="content">
                <div className="content">
                  <a href="#" className="content" data-bs-toggle="dropdown">
                    <i className="content"></i>Today
                  </a>
                  <ul className="content">
                    <li><a href="#" className="content">This Month</a></li>
                    <li><a href="#" className="content">This Week</a></li>
                    <li><a href="#" className="content">Today</a></li>
                  </ul>
                </div>
                <a href="#" className="content" onClick={(e) => { e.preventDefault(); setShowTodoModal(true); }}>
                  <i className="content"></i>
                </a>
              </div>
            </div>
            <div className="content">
              {['Add Holidays','Add Meeting to Client','Chat with Adrian','Management Call','Add Payroll','Add Policy for Increment'].map((t, i) => (
                <div className={`d-flex align-items-center todo-item border p-2 br-5 ${i < 5 ? 'mb-2' : 'mb-0'}`} key={i}>
                  <i className="content"></i>
                  <div className="content">
                    <input className="content" type="checkbox" id={`todo${i+1}`} />
                    <label className="content" htmlFor={`todo${i+1}`}>{t}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* /Todo */}
      </div>

      <div className="content">
        {/* Sales Overview */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Sales Overview</h5>
              <div className="content">
                <div className="content">
                  <a href="#" className="content" data-bs-toggle="dropdown">All Departments</a>
                  <ul className="content">
                    <li><a href="#" className="content">UI/UX Designer</a></li>
                    <li><a href="#" className="content">HR Manager</a></li>
                    <li><a href="#" className="content">Junior Tester</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="content">
                <div className="content">
                  <p className="content"><i className="content"></i>Income</p>
                  <p className="content"><i className="content"></i>Expenses</p>
                </div>
                <p className="content">Last Updated at 11:30PM</p>
              </div>
              <div id="sales-income">{/* Chart initialized by legacy JS */}</div>
            </div>
          </div>
        </div>
        {/* /Sales Overview */}

        {/* Invoices */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Invoices</h5>
              <div className="content">
                <div className="content">
                  <a href="#" className="content" data-bs-toggle="dropdown">Invoices</a>
                  <ul className="content">
                    <li><a href="#" className="content">Invoices</a></li>
                    <li><a href="#" className="content">Paid</a></li>
                    <li><a href="#" className="content">Unpaid</a></li>
                  </ul>
                </div>
                <div className="content">
                  <a href="#" className="content" data-bs-toggle="dropdown">
                    <i className="content"></i>This Week
                  </a>
                  <ul className="content">
                    <li><a href="#" className="content">This Month</a></li>
                    <li><a href="#" className="content">This Week</a></li>
                    <li><a href="#" className="content">Today</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="content">
                <table className="content">
                  <tbody>
                    {[
                      { img: 'user-39.jpg', title: 'Redesign Website', inv: '#INVOO2', company: 'Logistics', amount: '$3560', paid: false },
                      { img: 'user-40.jpg', title: 'Module Completion', inv: '#INVOO5', company: 'Yip Corp', amount: '$4175', paid: false },
                      { img: 'user-55.jpg', title: 'Change on Emp Module', inv: '#INVOO3', company: 'Ignis LLP', amount: '$6985', paid: false },
                      { img: 'user-42.jpg', title: 'Changes on the Board', inv: '#INVOO2', company: 'Ignis LLP', amount: '$1457', paid: false },
                      { img: 'user-44.jpg', title: 'Hospital Management', inv: '#INVOO6', company: 'HCL Corp', amount: '$6458', paid: true },
                    ].map((inv, i) => (
                      <tr key={i}>
                        <td className="content">
                          <div className="content">
                            <a href="#" className="content">
                              <img src={`assets/img/users/${inv.img}`} className="content" alt="img" />
                            </a>
                            <div className="content">
                              <h6 className="content"><a href="#">{inv.title}</a></h6>
                              <span className="content">{inv.inv}<i className="content"></i>{inv.company}</span>
                            </div>
                          </div>
                        </td>
                        <td><p className="content">Payment</p><h6 className="content">{inv.amount}</h6></td>
                        <td className="content">
                          <span className={`badge ${inv.paid ? 'badge-success-transparent' : 'badge-danger-transparent'} badge-xs d-inline-flex align-items-center`}>
                            <i className="content"></i>{inv.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a href="#" className="content">View All</a>
            </div>
          </div>
        </div>
        {/* /Invoices */}
      </div>

      <div className="content">
        {/* Projects */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Projects</h5>
              <div className="content">
                <a href="#" className="content" data-bs-toggle="dropdown">
                  <i className="content"></i>This Week
                </a>
                <ul className="content">
                  <li><a href="#" className="content">This Month</a></li>
                  <li><a href="#" className="content">This Week</a></li>
                  <li><a href="#" className="content">Today</a></li>
                </ul>
              </div>
            </div>
            <div className="content">
              <div className="content">
                <table className="content">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Team</th><th>Hours</th><th>Deadline</th><th>Priority</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id:'PRO-001', name:'Office Management App', avatars:['avatar-02','avatar-03','avatar-05'], hrs:'15/255', pct:40, date:'12/09/2024', priority:'High', badge:'badge-danger' },
                      { id:'PRO-002', name:'Clinic Management', avatars:['avatar-06','avatar-07','avatar-08'], extra:'+1', hrs:'15/255', pct:40, date:'24/10/2024', priority:'Low', badge:'badge-success' },
                      { id:'PRO-003', name:'Educational Platform', avatars:['avatar-06','avatar-08','avatar-09'], hrs:'40/255', pct:50, date:'18/02/2024', priority:'Medium', badge:'badge-pink' },
                      { id:'PRO-004', name:'Chat & Call Mobile App', avatars:['avatar-11','avatar-12','avatar-13'], hrs:'35/155', pct:50, date:'19/02/2024', priority:'High', badge:'badge-danger' },
                      { id:'PRO-005', name:'Travel Planning Website', avatars:['avatar-17','avatar-18','avatar-19'], hrs:'50/235', pct:50, date:'18/02/2024', priority:'Medium', badge:'badge-pink' },
                      { id:'PRO-006', name:'Service Booking Software', avatars:['avatar-06','avatar-08','avatar-09'], hrs:'40/255', pct:50, date:'20/02/2024', priority:'Low', badge:'badge-success' },
                      { id:'PRO-008', name:'Travel Planning Website', avatars:['avatar-15','avatar-16','avatar-17'], extra:'+2', hrs:'15/255', pct:45, date:'17/10/2024', priority:'Medium', badge:'badge-pink', last:true },
                    ].map((p, i) => (
                      <tr key={i}>
                        <td className={p.last ? 'border-0' : ''}><a href="#" className="content">{p.id}</a></td>
                        <td className={p.last ? 'border-0' : ''}><h6 className="content"><a href="#">{p.name}</a></h6></td>
                        <td className={p.last ? 'border-0' : ''}>
                          <div className="content">
                            {p.avatars.map((a, j) => (
                              <span className="content" key={j}>
                                <img className="content" src={`assets/img/profiles/${a}.jpg`} alt="img" />
                              </span>
                            ))}
                            {p.extra && <a className="content" href="#">{p.extra}</a>}
                          </div>
                        </td>
                        <td className={p.last ? 'border-0' : ''}>
                          <p className="content">{p.hrs} Hrs</p>
                          <div className="content"><div className="content" style={{ width: `${p.pct}%` }}></div></div>
                        </td>
                        <td className={p.last ? 'border-0' : ''}>{p.date}</td>
                        <td className={p.last ? 'border-0' : ''}>
                          <span className={`badge ${p.badge} d-inline-flex align-items-center badge-xs`}>
                            <i className="content"></i>{p.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* /Projects */}

        {/* Tasks Statistics */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Tasks Statistics</h5>
              <div className="content">
                <a href="#" className="content" data-bs-toggle="dropdown">
                  <i className="content"></i>This Week
                </a>
                <ul className="content">
                  <li><a href="#" className="content">This Month</a></li>
                  <li><a href="#" className="content">This Week</a></li>
                  <li><a href="#" className="content">Today</a></li>
                </ul>
              </div>
            </div>
            <div className="content">
              <div className="content">
                <canvas id="mySemiDonutChart" height="190"></canvas>
                <div className="content">
                  <p className="content">Total Tasks</p>
                  <h3>124/165</h3>
                </div>
              </div>
              <div className="content">
                {[
                  { color:'text-warning', label:'Ongoing', val:'24%' },
                  { color:'text-info', label:'On Hold', val:'10%' },
                  { color:'text-danger', label:'Overdue', val:'16%' },
                  { color:'text-success', label:'Ongoing', val:'40%' },
                ].map((s, i) => (
                  <div className="content" key={i}>
                    <p className={`fs-13 d-inline-flex align-items-center mb-1`}><i className={`ti ti-circle-filled fs-10 me-1 ${s.color}`}></i>{s.label}</p>
                    <h5>{s.val}</h5>
                  </div>
                ))}
              </div>
              <div className="content">
                <div className="content">
                  <h4 className="content">389/689 hrs</h4>
                  <p className="content">Spent on Overall Tasks This Week</p>
                </div>
                <a href="#" className="content">View All</a>
              </div>
            </div>
          </div>
        </div>
        {/* /Tasks Statistics */}
      </div>

      <div className="content">
        {/* Schedules */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Schedules</h5>
              <a href="#" className="content">View All</a>
            </div>
            <div className="content">
              {[
                { badge:'badge-secondary', badgeLabel:'UI/ UX Designer', title:'Interview Candidates - UI/UX Designer', date:'Thu, 15 Feb 2025', time:'01:00 PM - 02:20 PM' },
                { badge:'badge-dark', badgeLabel:'IOS Developer', title:'Interview Candidates - IOS Developer', date:'Thu, 15 Feb 2025', time:'02:00 PM - 04:20 PM' },
              ].map((s, i) => (
                <div className={`bg-light p-3 br-5 ${i === 0 ? 'mb-4' : 'mb-0'}`} key={i}>
                  <span className={`badge ${s.badge} badge-xs mb-1`}>{s.badgeLabel}</span>
                  <h6 className="content">{s.title}</h6>
                  <div className="content">
                    <p className="content"><i className="content"></i>{s.date}</p>
                    <p className="content"><i className="content"></i>{s.time}</p>
                  </div>
                  <div className="content">
                    <div className="content">
                      {['user-49','user-13','user-11','user-22','user-58'].map((u, j) => (
                        <span className="content" key={j}>
                          <img className="content" src={`assets/img/users/${u}.jpg`} alt="img" />
                        </span>
                      ))}
                      <a className="content" href="#">+3</a>
                    </div>
                    <a href="#" className="content">Join Meeting</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* /Schedules */}

        {/* Recent Activities */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Recent Activities</h5>
              <a href="#" className="content">View All</a>
            </div>
            <div className="content">
              {[
                { img:'user-38.jpg', name:'Matt Morgan', time:'05:30 PM', desc:<>Added New Project <span className="content">HRMS Dashboard</span></> },
                { img:'user-01.jpg', name:'Jay Ze', time:'05:00 PM', desc:'Commented on Uploaded Document' },
                { img:'user-19.jpg', name:'Mary Donald', time:'05:30 PM', desc:'Approved Task Projects' },
                { img:'user-11.jpg', name:'George David', time:'06:00 PM', desc:'Requesting Access to Module Tickets' },
                { img:'user-20.jpg', name:'Aaron Zeen', time:'06:30 PM', desc:'Downloaded App Reportss' },
                { img:'user-08.jpg', name:'Hendry Daniel', time:'05:30 PM', desc:'Completed New Project HMS' },
              ].map((a, i) => (
                <div className="content" key={i}>
                  <div className="content">
                    <div className="content">
                      <a href="#" className="content">
                        <img src={`assets/img/users/${a.img}`} className="content" alt="img" />
                      </a>
                      <div className="content">
                        <div className="content">
                          <h6 className="content"><a href="#">{a.name}</a></h6>
                          <p className="content">{a.time}</p>
                        </div>
                        <p className="content">{a.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* /Recent Activities */}

        {/* Birthdays */}
        <div className="content">
          <div className="content">
            <div className="content">
              <h5 className="content">Birthdays</h5>
              <a href="#" className="content">View All</a>
            </div>
            <div className="content">
              {[
                { section:'Today', entries:[{ img:'user-38.jpg', name:'Andrew Jermia', role:'IOS Developer' }] },
                { section:'Tomorow', entries:[
                  { img:'user-10.jpg', name:'Mary Zeen', role:'UI/UX Designer' },
                  { img:'user-09.jpg', name:'Antony Lewis', role:'Android Developer' },
                ]},
                { section:'25 Jan 2025', entries:[{ img:'user-12.jpg', name:'Doglas Martini', role:'.Net Developer' }] },
              ].map((g, gi) => (
                <div key={gi}>
                  <h6 className="content">{g.section}</h6>
                  {g.entries.map((b, bi) => (
                    <div className="content" key={bi}>
                      <div className="content">
                        <div className="content">
                          <a href="#" className="content">
                            <img src={`assets/img/users/${b.img}`} className="content" alt="img" />
                          </a>
                          <div className="content">
                            <h6 className="content">{b.name}</h6>
                            <p className="content">{b.role}</p>
                          </div>
                        </div>
                        <a href="#" className="content"><i className="content"></i>Send</a>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* /Birthdays */}
      </div>

      {/* â”€â”€ Add Todo Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showTodoModal && (
        <div className="content" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="content">
            <div className="content">
              <div className="content">
                <h4 className="content">Add New Todo</h4>
                <button type="button" className="content" onClick={() => setShowTodoModal(false)}>
                  <i className="content"></i>
                </button>
              </div>
              <div className="content">
                <div className="content">
                  <div className="content"><div className="content"><label className="content">Todo Title</label><input type="text" className="content" /></div></div>
                  <div className="content"><div className="content"><label className="content">Tag</label><select className="content"><option>Select</option><option>Internal</option><option>Projects</option><option>Meetings</option><option>Reminder</option></select></div></div>
                  <div className="content"><div className="content"><label className="content">Priority</label><select className="content"><option>Select</option><option>Medium</option><option>High</option><option>Low</option></select></div></div>
                  <div className="content"><div className="content"><label className="content">Descriptions</label><textarea className="content" rows="3"></textarea></div></div>
                  <div className="content"><div className="content"><label className="content">Add Assignee</label><select className="content"><option>Select</option><option>Sophie</option><option>Cameron</option><option>Doris</option><option>Rufana</option></select></div></div>
                  <div className="content"><div className="content"><label className="content">Status</label><select className="content"><option>Select</option><option>Completed</option><option>Pending</option><option>Onhold</option><option>Inprogress</option></select></div></div>
                </div>
              </div>
              <div className="content">
                <button type="button" className="content" onClick={() => setShowTodoModal(false)}>Cancel</button>
                <button type="button" className="content">Add New Todo</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Add Project Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showProjectModal && (
        <div className="content" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="content">
            <div className="content">
              <div className="content">
                <div className="content">
                  <h5 className="content">Add Project</h5>
                  <p className="content">Project ID : PRO-0004</p>
                </div>
                <button type="button" className="content" onClick={() => { setShowProjectModal(false); setWizardStep(1); }}>
                  <i className="content"></i>
                </button>
              </div>
              <div className="content">
                <div className="content">
                  <ul className="content">
                    <li className={`p-2 pt-0 ${wizardStep === 1 ? 'active' : ''}`}><h6 className="content">Basic Information</h6></li>
                    <li className={`p-2 pt-0 ${wizardStep === 2 ? 'active' : ''}`}><h6 className="content">Members</h6></li>
                  </ul>
                </div>
                {wizardStep === 1 && (
                  <div>
                    <div className="content">
                      <div className="content">
                        <div className="content">
                          <div className="content">
                            <div className="content">
                              <i className="content"></i>
                            </div>
                            <div className="content">
                              <div className="content"><h6 className="content">Upload Project Logo</h6><p className="content">Image should be below 4 mb</p></div>
                              <div className="content">
                                <div className="content">Upload<input type="file" className="content" multiple /></div>
                                <a href="#" className="content">Cancel</a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content"><div className="content"><label className="content">Project Name</label><input type="text" className="content" /></div></div>
                        <div className="content"><div className="content"><label className="content">Client</label><select className="content"><option>Select</option><option>Anthony Lewis</option><option>Brian Villalobos</option></select></div></div>
                        <div className="content"><div className="content"><label className="content">Start Date</label><input type="text" className="content" placeholder="dd/mm/yyyy" /></div></div>
                        <div className="content"><div className="content"><label className="content">End Date</label><input type="text" className="content" placeholder="dd/mm/yyyy" /></div></div>
                        <div className="content"><div className="content"><label className="content">Priority</label><select className="content"><option>Select</option><option>High</option><option>Medium</option><option>Low</option></select></div></div>
                        <div className="content"><div className="content"><label className="content">Project Value</label><input type="text" className="content" defaultValue="$" /></div></div>
                        <div className="content"><div className="content"><label className="content">Total Working Hours</label><input type="text" className="content" placeholder="-- : -- : --" /></div></div>
                        <div className="content"><div className="content"><label className="content">Extra Time</label><input type="text" className="content" /></div></div>
                        <div className="content"><div className="content"><label className="content">Description</label><textarea className="content" rows="3"></textarea></div></div>
                      </div>
                    </div>
                    <div className="content">
                      <button type="button" className="content" onClick={() => setShowProjectModal(false)}>Cancel</button>
                      <button className="content" type="button" onClick={() => setWizardStep(2)}>Add Team Member</button>
                    </div>
                  </div>
                )}
                {wizardStep === 2 && (
                  <div>
                    <div className="content">
                      <div className="content">
                        <div className="content"><div className="content"><label className="content">Team Members</label><input className="content" placeholder="Add new" type="text" defaultValue="Jerald, Andrew, Philip, Davis" /></div></div>
                        <div className="content"><div className="content"><label className="content">Team Leader</label><input className="content" placeholder="Add new" type="text" defaultValue="Hendry, James" /></div></div>
                        <div className="content"><div className="content"><label className="content">Project Manager</label><input className="content" placeholder="Add new" type="text" defaultValue="Dwight" /></div></div>
                        <div className="content"><div className="content"><label className="content">Status</label><select className="content"><option>Select</option><option>Active</option><option>Inactive</option></select></div></div>
                        <div className="content"><div><label className="content">Tags</label><select className="content"><option>Select</option><option>High</option><option>Low</option><option>Medium</option></select></div></div>
                      </div>
                    </div>
                    <div className="content">
                      <button type="button" className="content" onClick={() => setWizardStep(1)}>Back</button>
                      <button className="content" type="button" onClick={() => setShowProjectModal(false)}>Save</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Add Leaves Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showLeavesModal && (
        <div className="content" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="content">
            <div className="content">
              <div className="content">
                <h4 className="content">Add Leave Request</h4>
                <button type="button" className="content" onClick={() => setShowLeavesModal(false)}>
                  <i className="content"></i>
                </button>
              </div>
              <div className="content">
                <div className="content">
                  <div className="content"><div className="content"><label className="content">Employee Name</label><select className="content"><option>Select</option><option>Anthony Lewis</option><option>Brian Villalobos</option><option>Harvey Smith</option></select></div></div>
                  <div className="content"><div className="content"><label className="content">Leave Type</label><select className="content"><option>Select</option><option>Medical Leave</option><option>Casual Leave</option><option>Annual Leave</option></select></div></div>
                  <div className="content"><div className="content"><label className="content">From</label><input type="text" className="content" placeholder="dd/mm/yyyy" /></div></div>
                  <div className="content"><div className="content"><label className="content">To</label><input type="text" className="content" placeholder="dd/mm/yyyy" /></div></div>
                  <div className="content"><div className="content"><label className="content">No of Days</label><input type="text" className="content" disabled /></div></div>
                  <div className="content"><div className="content"><label className="content">Remaining Days</label><input type="text" className="content" disabled /></div></div>
                  <div className="content"><div className="content"><label className="content">Reason</label><textarea className="content" rows="3"></textarea></div></div>
                </div>
              </div>
              <div className="content">
                <button type="button" className="content" onClick={() => setShowLeavesModal(false)}>Cancel</button>
                <button type="button" className="content">Add Leaves</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboardPage


