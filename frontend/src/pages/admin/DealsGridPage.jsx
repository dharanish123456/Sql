import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PageLoader from "../../components/common/PageLoader";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/admin/PageHeader";
import crmService from "../../services/crmService";
import { dealsGridData } from "../../mock/dealsGridData";

export default function DealsGridPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["deals-grid"],
    queryFn: crmService.getDealsGrid,
    placeholderData: dealsGridData,
    keepPreviousData: true,
  });

  const pageData = {
    ...dealsGridData,
    ...(data || {}),
    header: {
      ...dealsGridData.header,
      ...(data?.header || {}),
      breadcrumbs: Array.isArray(data?.header?.breadcrumbs)
        ? data.header.breadcrumbs
        : dealsGridData.header.breadcrumbs,
    },
    columns: Array.isArray(data?.columns)
      ? data.columns
      : dealsGridData.columns,
  };

  const pageTitle = pageData?.header?.title || dealsGridData.header.title;
  const breadcrumbs = Array.isArray(pageData?.header?.breadcrumbs)
    ? pageData.header.breadcrumbs
    : dealsGridData.header.breadcrumbs;
  const columns = Array.isArray(pageData?.columns)
    ? pageData.columns
    : dealsGridData.columns;

  const getStageClass = (colorClass) => {
    if (typeof colorClass !== "string") return "badge-info-transparent";
    if (colorClass.startsWith("border-")) {
      return `badge-${colorClass.replace("border-", "")}-transparent`;
    }
    return "badge-info-transparent";
  };

  if (isLoading && !data) return <PageLoader />;
  if (error && !data) return <ErrorState onRetry={refetch} />;

  return (
    <>
      <PageHeader
        title={pageTitle}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <div className="me-2 mb-2">
              <div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
                <Link to="/deals" className="btn btn-icon btn-sm me-1">
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to="/deals?view=grid"
                  className="btn btn-icon btn-sm active bg-primary text-white"
                >
                  <i className="ti ti-layout-grid" />
                </Link>
              </div>
            </div>
            <div className="mb-2">
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#add_deals"
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="ti ti-circle-plus me-2" />
                Add Deal
              </a>
            </div>
            <div className="head-icons ms-2">
              <a href="javascript:void(0);" id="collapse-header">
                <i className="ti ti-chevrons-up" />
              </a>
            </div>
          </>
        }
      />

      <div className="card">
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between">
            <h5>Deals Grid</h5>
            <div className="dropdown">
              <a
                href="javascript:void(0);"
                className="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Sort By : Last 7 Days
              </a>
              <ul className="dropdown-menu dropdown-menu-end p-3">
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
                    Descending
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
      </div>

      <div className="row">
        {columns.flatMap((column) =>
          (Array.isArray(column.deals) ? column.deals : []).map((deal) => (
            <div key={deal.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="form-check form-check-md">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                    <div>
                      <a
                        href="deals-details.php"
                        className="avatar avatar-xl avatar-rounded border rounded-circle d-flex align-items-center justify-content-center bg-gray"
                      >
                        <span className="avatar-title text-dark fw-bold">
                          {deal.initials}
                        </span>
                      </a>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-icon btn-sm rounded-circle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti ti-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <a
                            className="dropdown-item rounded-1"
                            href="javascript:void(0);"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_deals"
                          >
                            <i className="ti ti-edit me-1"></i>Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item rounded-1"
                            href="javascript:void(0);"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_modal"
                          >
                            <i className="ti ti-trash me-1"></i>Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <h6 className="mb-1">
                      <a href="deals-details.php">{deal.name}</a>
                    </h6>
                    <span
                      className={`badge badge-sm ${getStageClass(column.colorClass)}`}
                    >
                      {column.title}
                    </span>
                  </div>

                  <div className="d-flex flex-column">
                    <p className="text-dark d-inline-flex align-items-center mb-2">
                      <i className="ti ti-currency-dollar text-gray-5 me-2"></i>
                      {deal.amount}
                    </p>
                    <p className="text-dark d-inline-flex align-items-center mb-2">
                      <i className="ti ti-mail text-gray-5 me-2"></i>
                      {deal.email}
                    </p>
                    <p className="text-dark d-inline-flex align-items-center mb-2">
                      <i className="ti ti-phone text-gray-5 me-2"></i>
                      {deal.phone}
                    </p>
                    <p className="text-dark d-inline-flex align-items-center">
                      <i className="ti ti-map-pin text-gray-5 me-2"></i>
                      {deal.location}
                    </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
                      >
                        <img src={deal.ownerAvatar} alt={deal.owner} />
                      </a>
                      <a href="javascript:void(0);" className="text-dark">
                        {deal.owner}
                      </a>
                    </div>
                    <span className="badge badge-sm badge-info-transparent">
                      <i className="ti ti-progress me-1" />
                      {deal.progress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )),
        )}
      </div>
    </>
  );
}
