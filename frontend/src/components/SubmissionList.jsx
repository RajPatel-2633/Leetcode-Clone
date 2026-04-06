import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  // Helper function to calculate average memory usage
  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  // Apply filtering by status
  const filteredSubmissions = submissions.filter((submission) => {
    if (statusFilter === "all") return true;
    return submission.status === statusFilter;
  });

  // Apply sorting by createdAt
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const toggleExpand = (id) => {
    setExpandedSubmissionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/70">Filter:</span>
          <select
            className="select select-sm select-bordered bg-base-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/70">Sort:</span>
          <select
            className="select select-sm select-bordered bg-base-200"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {sortedSubmissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <div
            key={submission.id}
            className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow rounded-lg"
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                {/* Left Section: Status and Language */}
                <div className="flex items-center gap-4">
                  {submission.status === "Accepted" ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-error">
                      <XCircle className="w-6 h-6" />
                      <span className="font-semibold">{submission.status}</span>
                    </div>
                  )}
                  <div className="badge badge-neutral">{submission.language}</div>
                </div>

                {/* Right Section: Runtime, Memory, Date, and Details toggle */}
                <div className="flex items-center gap-4 text-base-content/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{avgTime.toFixed(3)} s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Memory className="w-4 h-4" />
                    <span>{avgMemory.toFixed(0)} KB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() => toggleExpand(submission.id)}
                  >
                    {expandedSubmissionId === submission.id
                      ? "Hide details"
                      : "View details"}
                  </button>
                </div>
              </div>

              {expandedSubmissionId === submission.id && (
                <div className="mt-4 border-t border-base-300 pt-4 space-y-3">
                  <div>
                    <div className="text-sm font-semibold mb-1">Your code</div>
                    <div className="mockup-code bg-base-100">
                      <pre className="p-3 overflow-x-auto">
                        <code>{submission.sourceCode}</code>
                      </pre>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm font-semibold mb-1">Input</div>
                      <div className="mockup-code bg-base-100">
                        <pre className="p-3 overflow-x-auto">
                          <code>{submission.stdin || "No input provided"}</code>
                        </pre>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        Output (stdout)
                      </div>
                      <div className="mockup-code bg-base-100">
                        <pre className="p-3 overflow-x-auto">
                          <code>
                            {Array.isArray(safeParse(submission.stdout))
                              ? safeParse(submission.stdout).join("")
                              : submission.stdout || "No output"}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;