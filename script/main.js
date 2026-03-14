// ===== GLOBAL VARIABLES =====

let issues = [];
let currentStatus = "all";

const issuesContainer = document.getElementById("issues-container");
const totalCount = document.getElementById("total-count");


// ===== FILTER BUTTONS =====

document.getElementById("all-btn").addEventListener("click", () => {
    currentStatus = "all";
    setActiveButton("all-btn");
    displayIssues();
});

document.getElementById("open-btn").addEventListener("click", () => {
    currentStatus = "open";
    setActiveButton("open-btn");
    displayIssues();
});

document.getElementById("closed-btn").addEventListener("click", () => {
    currentStatus = "closed";
    setActiveButton("closed-btn");
    displayIssues();
});


// ===== ACTIVE BUTTON STYLE =====

function setActiveButton(buttonId) {

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => {
        btn.classList.remove("bg-primary", "text-white");
    });

    const activeBtn = document.getElementById(buttonId);

    activeBtn.classList.add("bg-primary", "text-white");
}


// ===== LOAD API DATA =====

async function loadIssues() {

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    issues = data.data;

    setActiveButton("all-btn");

    displayIssues();
}

loadIssues();


// ===== STATUS STYLE =====

function getStatusStyle(status) {

    if (status === "open") {
        return {
            border: "border-emerald-400",
            icon: "./assets/Open-Status.png"
        };
    }

    if (status === "closed") {
        return {
            border: "border-purple-400",
            icon: "./assets/Closed-Status.png"
        };
    }

}


// ===== PRIORITY STYLE =====

function getPriorityStyle(priority) {

    if (priority === "high") {
        return "bg-red-100 text-red-600";
    }

    if (priority === "medium") {
        return "bg-yellow-100 text-yellow-600";
    }

    if (priority === "low") {
        return "bg-gray-200 text-gray-600";
    }

}


// ===== LABEL STYLE =====

function getLabelStyle(label) {

    const l = label.toLowerCase();

    if (l === "bug") {
        return "bg-red-100 text-red-600";
    }

    if (l === "enhancement") {
        return "bg-green-100 text-green-600";
    }

    return "bg-orange-100 text-orange-600";

}


// ===== CREATE LABELS =====

function createLabels(labels) {

    return labels.map(label => {

        const style = getLabelStyle(label);

        return `
      <span class="${style} px-3 py-1 rounded-full text-sm">
        ${label}
      </span>
    `;

    }).join("");

}


// ===== DISPLAY ISSUES =====

function displayIssues() {

    issuesContainer.innerHTML = "";

    let filteredIssues = issues;

    if (currentStatus !== "all") {
        filteredIssues = issues.filter(issue => issue.status === currentStatus);
    }

    totalCount.innerText = filteredIssues.length;

    filteredIssues.forEach(issue => {

        const statusStyle = getStatusStyle(issue.status);
        const priorityStyle = getPriorityStyle(issue.priority);
        const labels = createLabels(issue.labels);

        const date = new Date(issue.createdAt).toLocaleDateString();

        const div = document.createElement("div");

        div.innerHTML = `
    
        <div onclick="openIssueModal(${issue.id})" class="border-t-4 ${statusStyle.border} rounded-lg p-4 shadow-md cursor-pointer">
            <div  class="flex justify-between items-center"
                <img src="${statusStyle.icon}" alt="">
                <p class="${priorityStyle} rounded-xl px-3 py-1 text-sm">
                    ${issue.priority.toUpperCase()}
                </p>

            </div>

            <div class="space-y-2 my-3">
                <h2 class="text-lg font-semibold">${issue.title}</h2>
                <p class="text-gray-500">${issue.description}</p>
            </div>

            <div class="flex gap-2 my-4">
              ${labels}
            </div>

            <hr class="border-gray-200 -mx-4">

            <div class="space-y-2 my-3 text-gray-500 text-sm">
              <p>#${issue.id} by ${issue.author}</p>
              <p>${date}</p>
            </div>

        </div>   
        `;

        issuesContainer.appendChild(div);

    });

};

function openIssueModal(id) {

    const issue = issues.find(i => i.id === id);

    const date = new Date(issue.createdAt).toLocaleDateString();

    document.getElementById("modal-title").innerText = issue.title;

    document.getElementById("modal-author").innerText =
        "Opened by " + issue.author;

    document.getElementById("modal-date").innerText = date;

    document.getElementById("modal-description").innerText =
        issue.description;

    document.getElementById("modal-assignee").innerText =
        issue.assignee;

    let statusColor = "";

    if (issue.status === "open") {
        statusColor = "bg-green-500";
    } else {
        statusColor = "bg-purple-500";
    }

    document.getElementById("modal-status").innerHTML =
        `<span class="${statusColor} text-white px-2 py-1 rounded">
            ${issue.status}
        </span>`;

    document.getElementById("modal-priority").innerHTML =
        `<span class="bg-red-500 text-white px-3 py-1 rounded-full">
      ${issue.priority}
     </span>`;

    document.getElementById("modal-labels").innerHTML =
        createLabels(issue.labels);

    document.getElementById("issue_modal").showModal();
};

function closeModal() {
    document.getElementById("issue_modal").close();
};

async function searchIssues() {
    const searchText = document.getElementById("search-input").value;

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);

    const data = await res.json();
    issues = data.data;
    currentStatus = "all";
    setActiveButton("all-btn");
    displayIssues();
}
