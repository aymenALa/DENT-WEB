import React, { useEffect, useState } from "react";
import AngleImageAnnotator from "./AngleImageAnnotator";

const emptyAnalysis = () => ({ image: "", angles: [] });

const imagePayload = (dataUrl) => dataUrl?.split(",")[1] || null;

// Prototype score: each of the three guessed angles is compared with a neutral 90° target.
const scoreAngles = (angles) => {
  if (angles.length !== 3) return 0;
  const averageError = angles.reduce((sum, angle) => sum + Math.abs(90 - angle), 0) / 3;
  return Number((Math.max(0, 10 - averageError / 9)).toFixed(2));
};

const StudentHome = () => {
  const userlogin = JSON.parse(localStorage.getItem("userlogin")) || {};
  const studentId = userlogin.id;
  const port = import.meta.env.VITE_PORT_SPRING || 5050;
  const api = `http://localhost:${port}/api`;

  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", userName: "", email: "", number: "" });
  const [activeTab, setActiveTab] = useState("assignments");
  const [editingProfile, setEditingProfile] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [selectedPw, setSelectedPw] = useState(null);
  const [front, setFront] = useState(emptyAnalysis());
  const [side, setSide] = useState(emptyAnalysis());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [studentResponse, completedResponse] = await Promise.all([
        fetch(`${api}/users/${studentId}`),
        fetch(`${api}/users/testpw/${studentId}`),
      ]);
      if (!studentResponse.ok || !completedResponse.ok) throw new Error("Could not load the student dashboard.");
      const studentData = await studentResponse.json();
      setStudent(studentData);
      setProfile({
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        userName: studentData.userName || "",
        email: studentData.email || "",
        number: studentData.number || "",
      });
      setCompleted(await completedResponse.json());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) loadDashboard();
    else {
      setMessage("No logged-in student was found.");
      setLoading(false);
    }
  }, [studentId]);

  const openAnalysis = (pw) => {
    setSelectedPw(pw);
    setFront(emptyAnalysis());
    setSide(emptyAnalysis());
    setMessage("");
  };

  const updateProfileField = (event) => {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const cancelProfileEdit = () => {
    setProfile({
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      userName: student?.userName || "",
      email: student?.email || "",
      number: student?.number || "",
    });
    setEditingProfile(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${api}/users/update/student/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not update the profile.");
      setStudent((current) => ({ ...current, ...profile }));
      localStorage.setItem("userlogin", JSON.stringify({ ...userlogin, ...profile }));
      setEditingProfile(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitAnalysis = async () => {
    if (front.angles.length !== 3 || side.angles.length !== 3) {
      setMessage("Select all nine landmarks on both images before submitting.");
      return;
    }

    const [af1, bf1, cf1] = front.angles;
    const [as1, bs1, cs1] = side.angles;
    const body = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().slice(0, 10),
      imageFront: imagePayload(front.image),
      imageSide: imagePayload(side.image),
      af1, af2: Number((180 - af1).toFixed(2)),
      bf1, bf2: Number((180 - bf1).toFixed(2)),
      cf1, cf2: Number((180 - cf1).toFixed(2)),
      as1, as2: Number((180 - as1).toFixed(2)),
      bs1, bs2: Number((180 - bs1).toFixed(2)),
      cs1, cs2: Number((180 - cs1).toFixed(2)),
      noteFront: scoreAngles(front.angles),
      noteSide: scoreAngles(side.angles),
    };

    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${api}/studentpws/add/${studentId}/${selectedPw.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Submission failed.");
      setMessage("Analysis submitted successfully.");
      setSelectedPw(null);
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const pws = student?.group?.pws || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600">E-Dent Student Platform</h1>
            <p className="text-xs text-gray-500">Prototype image landmark analysis</p>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                  className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white">Logout</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {message && <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{message}</div>}
        {loading ? <p className="text-sm text-gray-500">Loading assignments…</p> : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Welcome{student?.firstName ? `, ${student.firstName}` : ""}</h2>
              <p className="mt-1 text-sm text-gray-500">Manage your profile and practical work from one place.</p>
            </div>
            <nav className="mb-6 flex gap-2 border-b">
              <button onClick={() => setActiveTab("assignments")}
                      className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === "assignments" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>
                Practical work
              </button>
              <button onClick={() => setActiveTab("profile")}
                      className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === "profile" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>
                My profile
              </button>
            </nav>

            {activeTab === "assignments" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pws.map((pw, index) => (
                  <article key={pw.id} className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{pw.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${completed[index] ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {completed[index] ? "Submitted" : "Pending"}
                      </span>
                    </div>
                    <p className="my-3 min-h-10 text-sm text-gray-500">{pw.objectif}</p>
                    <button disabled={completed[index]} onClick={() => openAnalysis(pw)}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300">
                      {completed[index] ? "Already submitted" : "Start analysis"}
                    </button>
                  </article>
                ))}
                {!pws.length && <p className="text-sm text-gray-500">No practical work is assigned to your group.</p>}
              </div>
            )}

            {activeTab === "profile" && (
              <section className="max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Personal information</h3>
                    <p className="text-xs text-gray-500">Your group assignment cannot be changed here.</p>
                  </div>
                  {!editingProfile && (
                    <button onClick={() => setEditingProfile(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      Edit information
                    </button>
                  )}
                </div>
                <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["firstName", "First name", "text"],
                    ["lastName", "Last name", "text"],
                    ["userName", "Username", "text"],
                    ["email", "Email", "email"],
                    ["number", "Phone number", "tel"],
                  ].map(([name, label, type]) => (
                    <label key={name} className={name === "number" ? "sm:col-span-2" : ""}>
                      <span className="mb-1 block text-xs font-semibold text-gray-500">{label}</span>
                      <input name={name} type={type} value={profile[name]} onChange={updateProfileField}
                             disabled={!editingProfile} required={name !== "number"}
                             className="w-full rounded-lg border-gray-300 text-sm disabled:bg-gray-50 disabled:text-gray-600" />
                    </label>
                  ))}
                  {editingProfile && (
                    <div className="flex justify-end gap-3 sm:col-span-2">
                      <button type="button" onClick={cancelProfileEdit} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
                      <button type="submit" disabled={submitting} className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white disabled:bg-gray-300">
                        {submitting ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  )}
                </form>
              </section>
            )}
          </>
        )}

        {selectedPw && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
            <div className="mx-auto my-4 max-w-6xl rounded-2xl bg-gray-50 p-5 shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedPw.title}</h2>
                  <p className="text-xs text-gray-500">Prototype only: the supplementary angle is stored as the second value.</p>
                </div>
                <button onClick={() => setSelectedPw(null)} className="text-2xl text-gray-500">×</button>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <AngleImageAnnotator label="Front" value={front} onChange={setFront} />
                <AngleImageAnnotator label="Side" value={side} onChange={setSide} />
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setSelectedPw(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
                <button onClick={submitAnalysis} disabled={submitting || front.angles.length !== 3 || side.angles.length !== 3}
                        className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white disabled:bg-gray-300">
                  {submitting ? "Submitting…" : "Submit analysis"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentHome;
