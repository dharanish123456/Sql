import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { attachAdminNavigationHandlers } from "../../utils/adminNavigation";
import { useAuth } from "../../context/AuthContext";

const topbarHtml = `<!-- Header -->
<div class="header">
	<div class="main-header">

		<div class="header-left">
			<a href="dashboard.php" class="logo">
				<img src="/assets/img/logo.svg" alt="Logo">
			</a>
			<a href="dashboard.php" class="dark-logo">
				<img src="/assets/img/logo-white.svg" alt="Logo">
			</a>
		</div>

		<a id="mobile_btn" class="mobile_btn" href="#sidebar">
			<span class="bar-icon">
				<span></span>
				<span></span>
				<span></span>
			</span>
		</a>

		<div class="header-user">
			<div class="nav user-menu nav-list">

				<div class="me-auto d-flex align-items-center" id="header-search">
					<a id="toggle_btn" href="javascript:void(0);" class="btn btn-menubar me-1">
						<i class="ti ti-arrow-bar-to-left"></i>
					</a>
					<!-- Search -->
					<div class="input-group input-group-flat d-inline-flex me-1">
						<span class="input-icon-addon">
							<i class="ti ti-search"></i>
						</span>
						<input type="text" class="form-control" placeholder="Search in HRMS">
						<span class="input-group-text">
							<kbd>CTRL + / </kbd>
						</span>
					</div>
					<!-- /Search -->
					<div class="dropdown crm-dropdown">
						<a href="#" class="btn btn-menubar me-1" data-bs-toggle="dropdown">
							<i class="ti ti-layout-grid"></i>
						</a>
						<div class="dropdown-menu dropdown-lg dropdown-menu-start">
							<div class="card mb-0 border-0 shadow-none">
								<div class="card-header">
									<h4>CRM</h4>
								</div>
								<div class="card-body pb-1">
									<div class="row">
										<div class="col-sm-6">
											<a href="contacts.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-user-shield text-default me-2"></i>Contacts
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="deals-grid.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-heart-handshake text-default me-2"></i>Deals
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="pipeline.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-timeline-event-text text-default me-2"></i>Pipeline
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
										</div>
										<div class="col-sm-6">
											<a href="companies-grid.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-building text-default me-2"></i>Companies
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="leads-grid.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-user-check text-default me-2"></i>Leads
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
											<a href="activity.php" class="d-flex align-items-center justify-content-between p-2 crm-link mb-3">
												<span class="d-flex align-items-center me-3">
													<i class="ti ti-activity text-default me-2"></i>Activities
												</span>
												<i class="ti ti-arrow-right"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<a href="profile-settings.php" class="btn btn-menubar">
						<i class="ti ti-settings-cog"></i>
					</a>
				</div>
				<div class="d-flex align-items-center header-actions">
					<a href="javascript:void(0);" class="btn btn-menubar me-1">
						<i class="ti ti-maximize"></i>
					</a>
					<a href="/apps" class="btn btn-menubar me-1">
						<i class="ti ti-layout-grid"></i>
					</a>
					<a href="/lead-chats" class="btn btn-menubar me-1">
						<i class="ti ti-message"></i>
					</a>
					<a href="/email" class="btn btn-menubar me-1">
						<i class="ti ti-mail"></i>
					</a>
					<a href="#" class="btn btn-menubar position-relative">
						<i class="ti ti-bell"></i>
						<span class="notification-status-dot"></span>
					</a>
					<div class="dropdown profile-dropdown ms-2">
						<a
							href="#"
							class="dropdown-toggle d-flex align-items-center"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<span class="avatar avatar-sm online">
								<img src="/assets/img/profiles/avatar-12.jpg" alt="User" />
							</span>
						</a>
						<div class="dropdown-menu dropdown-menu-end shadow-none">
							<a class="dropdown-item" href="adminuseredit.php?usertoedit=admin">My Profile</a>
							<a class="dropdown-item" href="profile-settings.php">Settings</a>
							<a class="dropdown-item" href="logout.php?path=admin">Logout</a>
						</div>
					</div>
				</div>

				<!-- Horizontal Single -->
				<div class="sidebar sidebar-horizontal" id="horizontal-menu">
					<div class="sidebar-menu"></div>
				</div>

				<!-- Mobile Menu -->
		<div class="dropdown mobile-user-menu">
			<a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
			<div class="dropdown-menu dropdown-menu-end">
				<a class="dropdown-item" href="adminuseredit.php?usertoedit=admin">My Profile</a>
				<a class="dropdown-item" href="profile-settings.php">Settings</a>
				<a class="dropdown-item" href="logout.php?path=admin">Logout</a>
			</div>
		</div>
		<!-- /Mobile Menu -->

	</div>

</div>
<!-- /Header -->`;

export default function Topbar() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } finally {
        navigate("/login", { replace: true });
      }
    };

    const cleanupNavigation = attachAdminNavigationHandlers(
      containerRef.current,
      navigate,
      {
        onLogout: handleLogout,
      },
    );

    const role = String(user?.role || "").toUpperCase();
    if (role === "EMPLOYEE") {
      const container = containerRef.current;
      if (container) {
        container
          .querySelectorAll('a[href="/lead-chats"]')
          .forEach((node) => node.remove());
      }
    }

    const getHorizontalRoot = () => {
      const container = containerRef.current;
      if (!container) return null;
      return (
        container.querySelector("#horizontal-menu") ||
        container.querySelector("#horizontal-single")
      );
    };

    const updateHorizontalId = () => {
      const root = getHorizontalRoot();
      if (!root) return;
      const layout = document.documentElement.getAttribute("data-layout");
      const desiredId = layout === "horizontal-single" ? "horizontal-single" : "horizontal-menu";
      if (root.id !== desiredId) {
        root.id = desiredId;
      }
    };

    const syncHorizontalMenu = () => {
      const container = containerRef.current;
      if (!container) return;
      const horizontalRoot = getHorizontalRoot();
      const horizontalMenu = horizontalRoot?.querySelector(".sidebar-menu");
      const verticalMenu = document.querySelector("#sidebar-menu");
      if (!horizontalRoot || !horizontalMenu || !verticalMenu) return;
      const sourceList = verticalMenu.querySelector(":scope > ul");
      if (!sourceList) return;

      const navMenu = document.createElement("ul");
      navMenu.className = "nav-menu";

      const appendSanitizedItem = (item) => {
        if (!(item instanceof HTMLElement)) return;
        const anchor = item.querySelector(":scope > a");
        if (anchor && anchor.getAttribute("href")?.startsWith("javascript:")) {
          anchor.setAttribute("href", "#");
        }
        navMenu.appendChild(item);
      };

      let currentSection = null;
      let currentItems = [];

      const flushSection = () => {
        if (!currentSection || currentItems.length === 0) {
          currentSection = null;
          currentItems = [];
          return;
        }

        const sectionTitle = currentSection;
        const itemsToAppend = currentItems;
        currentSection = null;
        currentItems = [];

        if (["CRM", "HRM", "SETTINGS"].includes(sectionTitle.toUpperCase())) {
          const sectionLi = document.createElement("li");
          sectionLi.className = "submenu";
          sectionLi.innerHTML = `<a href="#"><i class="ti ti-layout-grid"></i><span>${sectionTitle}</span><span class="menu-arrow"></span></a>`;
          const sectionUl = document.createElement("ul");
          itemsToAppend.forEach((item) => sectionUl.appendChild(item));
          sectionLi.appendChild(sectionUl);
          navMenu.appendChild(sectionLi);
        } else {
          itemsToAppend.forEach((item) => navMenu.appendChild(item));
        }
      };

      Array.from(sourceList.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        if (child.classList.contains("menu-title")) {
          flushSection();
          const label = child.textContent?.trim();
          if (label) {
            currentSection = label;
          }
          return;
        }

        const directLink = child.querySelector(":scope > a");
        const directList = child.querySelector(":scope > ul");

        if (!directLink && directList) {
          Array.from(directList.children).forEach((inner) => {
            if (!(inner instanceof HTMLElement)) return;
            const clonedInner = inner.cloneNode(true);
            if (currentSection) {
              currentItems.push(clonedInner);
            } else {
              appendSanitizedItem(clonedInner);
            }
          });
          return;
        }

        const clonedChild = child.cloneNode(true);
        if (currentSection) {
          currentItems.push(clonedChild);
        } else {
          appendSanitizedItem(clonedChild);
        }
      });

      flushSection();

      const mainMenu = document.createElement("div");
      mainMenu.className = "main-menu";
      mainMenu.appendChild(navMenu);
      horizontalMenu.innerHTML = "";
      horizontalMenu.appendChild(mainMenu);

      navMenu.style.transform = "";
    };

    const syncWithDelay = () => {
      updateHorizontalId();
      syncHorizontalMenu();
      setTimeout(syncHorizontalMenu, 300);
    };

    syncWithDelay();

    let observer = null;
    const verticalMenu = document.querySelector("#sidebar-menu");
    if (verticalMenu && "MutationObserver" in window) {
      observer = new MutationObserver(() => {
        updateHorizontalId();
        syncHorizontalMenu();
      });
      observer.observe(verticalMenu, { childList: true, subtree: true });
    }

    let layoutObserver = null;
    if ("MutationObserver" in window) {
      layoutObserver = new MutationObserver(() => {
        updateHorizontalId();
        syncHorizontalMenu();
      });
      layoutObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-layout"],
      });
    }

    const showWelcomeToast = () => {
      const shouldShow = sessionStorage.getItem("showWelcomeToast") === "1";
      if (!shouldShow) return;
      const container = containerRef.current;
      if (!container) return;
      let toast = container.querySelector("#welcome-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "welcome-toast";
        toast.className = "welcome-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        container.appendChild(toast);
      }
      const fallbackIdentifier = sessionStorage.getItem("lastLoginIdentifier") || "";
      const fallbackUsername =
        fallbackIdentifier && !fallbackIdentifier.includes("@")
          ? fallbackIdentifier
          : "";
      const displayName = user?.username || fallbackUsername;
      const label = displayName ? `Welcome back, ${displayName}` : "Welcome back";
      toast.textContent = label;
      toast.classList.add("show");
      sessionStorage.removeItem("showWelcomeToast");
      window.setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    };

    showWelcomeToast();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (layoutObserver) {
        layoutObserver.disconnect();
      }
      cleanupNavigation();
    };
  }, [navigate, logout, user?.email, user?.username, user?.firstName, user?.lastName]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: topbarHtml }} />;
}

