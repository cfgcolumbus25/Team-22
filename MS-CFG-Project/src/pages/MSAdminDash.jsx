import React, { useState, useEffect } from 'react'
import './MSAdminDash.css'

// MSAdminDash: Admin dashboard page showing reported universities / schools.
// This file is intentionally full of explanatory comments so future maintainers
// and non-technical stakeholders can follow the UI structure and easily change
// the behavior. Treat the mock data below as a placeholder for a real API.

export default function MSAdminDash() {
	// useState holds the list of reported schools; in a real app this would
	// come from an API call (e.g., fetch('/api/reported-schools')). We initialize
	// with a small mock so the UI renders immediately and is easy to test.
		// Updated mock data to match the admin's required columns. Each record
		// now contains an institutionId, a contact person, a verification status,
		// and a lastUpdated timestamp. Replace this with your API shape when ready.
		const [reportedSchools, setReportedSchools] = useState([
			{
				id: 's1',
				name: 'Sunrise University',
				institutionId: 'INST-001',
				contactPerson: 'Patricia Gomez',
				verified: false,
				lastUpdated: '2025-11-01T09:15:00Z',
			},
			{
				id: 's2',
				name: 'Harborview College',
				institutionId: 'INST-024',
				contactPerson: 'Marcus Liu',
				verified: true,
				lastUpdated: '2025-10-28T13:42:00Z',
			},
			{
				id: 's3',
				name: 'Prairie Tech',
				institutionId: 'INST-078',
				contactPerson: 'Aisha Khan',
				verified: false,
				lastUpdated: '2025-11-06T17:05:00Z',
			},
		])

	// useEffect simulates loading real data on mount. For now it simply logs
	// that the admin dash mounted; replace this with an async fetch to your
	// backend and call setReportedSchools(response) when ready.
	useEffect(() => {
		// Story: when the admin opens this page, we should fetch the current list
		// of schools that learners flagged as having incorrect/missing info.
		console.log('MSAdminDash mounted — replace this with API fetch for real data')
	}, [])

	// Helper: markSchoolVerified simulates the admin verifying a school. In a
	// real integration this would call an endpoint to update the school's
	// verification status and then refresh the list.
	const markSchoolVerified = (schoolId) => {
		// Story: admin clicks "Verify" — we optimistically remove the report
		// from the list locally so the card reflects the change immediately.
		setReportedSchools((prev) => prev.filter((s) => s.id !== schoolId))
		// TODO: call the backend API here to persist the verification.
	}

	// Helper: render action column buttons; these currently are placeholders
	// to show where business actions (verify, view) will live.
	const Actions = ({ school }) => (
		<div className="ms-actions">
			{/* Verify button: marks the report as handled */}
			<button
				className="ms-btn ms-btn-verify"
				onClick={() => markSchoolVerified(school.id)}
				title={`Verify ${school.name}`}
			>
				Verify
			</button>

			{/* View button placeholder: open a detail modal or navigate to school */}
			<button
				className="ms-btn ms-btn-view"
				onClick={() => alert(`Open details for ${school.name} (placeholder)`)}
				title={`View ${school.name}`}
			>
				View
			</button>
		</div>
	)

	// Main render: a centered container with a card containing a table of
	// reported schools. This layout keeps the middle-of-page focus the
	// stakeholder requested — the admin needs to see pending reports quickly.
		return (
			<div className="ms-page-wrapper">
				<div className="ms-admin-container">
			{/* Page header with context for the admin user */}
			<header className="ms-header">
				<h1 className="ms-title">Admin Dashboard</h1>
				<p className="ms-subtitle">Reported universities and missing/incorrect info</p>
			</header>

			{/* Central card that highlights reported schools — the main focus area */}
			<section className="ms-reported-card">
				{/* Card title with a count badge showing how many reports are pending */}
				<div className="ms-card-header">
					<h2>Reported Universities</h2>
					<span className="ms-badge">{reportedSchools.length}</span>
				</div>

				{/* If there are no reports, show a friendly empty state hint */}
				{reportedSchools.length === 0 ? (
					<div className="ms-empty">No reported universities — nothing to verify.</div>
				) : (
					<div className="ms-table-wrap">
						<table className="ms-school-table" role="table" aria-label="Reported schools">
							<thead>
												<tr>
													{/* Column titles requested by the stakeholder. Keep labels
															concise and consistent with the learner-facing dashboard. */}
													<th>School Name</th>
													<th>Institution ID</th>
													<th>Contact Person</th>
													<th>Status</th>
													<th>Last Updated</th>
													<th>Actions</th>
												</tr>
							</thead>
							<tbody>
								{reportedSchools.map((school) => (
									<tr key={school.id} className="ms-school-row">
										<td className="ms-td-name">{school.name}</td>
										<td className="ms-td-instid">{school.institutionId}</td>
										<td className="ms-td-contact">{school.contactPerson}</td>
										<td className="ms-td-status">
											{/* Status shows verified vs unverified. Use clear badges so
												admins can scan quickly; text remains black per brand
												guidance while backgrounds indicate meaning. */}
											{school.verified ? (
												<span className="ms-flag ms-flag-verified">Verified</span>
											) : (
												<span className="ms-flag ms-flag-unverified">Unverified</span>
											)}
										</td>
										<td className="ms-td-updated">{new Date(school.lastUpdated).toLocaleString()}</td>
										<td className="ms-td-actions">
											<Actions school={school} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Footer area in the card for quick tips and next actions */}
				<footer className="ms-card-footer">
					<small>
						Tip: Use "Verify" to mark reports handled. Connect this page to the
						real reports API to persist changes and audit admin actions.
					</small>
				</footer>
					</section>
					</div>
				</div>
	)
}


