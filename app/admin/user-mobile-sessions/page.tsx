"use client";
import React, { useEffect, useState } from 'react';
import { getUserMobileSessions, verifyUserMobileSession } from '../../../utils/api/admin';
import styles from './style.module.scss';

interface UserMobileSession {
  _id: string;
  mobile: string;
  otp: string;
  isMobileVerification: boolean;
  browser: string;
  ip: string;
  device: string;
  createdAt: string;
  updatedAt: string;
}

const UserMobileSessionsAdminPage = () => {
  const [sessions, setSessions] = useState<UserMobileSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isMobileVerification, setIsMobileVerification] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    fetchSessions();
  }, [page, limit]);

  const fetchSessions = async () => {
    setLoading(true);
    const params: any = { page, limit };
    if (mobile) params.mobile = mobile;
    if (isMobileVerification) params.isMobileVerification = isMobileVerification;
    const res = await getUserMobileSessions(params);
    setSessions(res.data || []);
    setLoading(false);
  };

  const handleVerify = async (sessionId: string) => {
    await verifyUserMobileSession(sessionId);
    fetchSessions();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>User Mobile Sessions (Admin)</h1>
      <div className={styles.filter}>
        <input placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
        <select value={isMobileVerification} onChange={e => setIsMobileVerification(e.target.value)}>
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </select>
        <button className={styles.button} onClick={fetchSessions}>Filter</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mobile</th>
              <th>OTP</th>
              <th>Verified</th>
              <th>Browser</th>
              <th>IP</th>
              <th>Device</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session._id}>
                <td>{session.mobile}</td>
                <td>{session.otp}</td>
                <td>{session.isMobileVerification ? 'Yes' : 'No'}</td>
                <td>{session.browser}</td>
                <td>{session.ip}</td>
                <td>{session.device}</td>
                <td>{new Date(session.createdAt).toLocaleString()}</td>
                <td>{new Date(session.updatedAt).toLocaleString()}</td>
                <td>
                  {!session.isMobileVerification && (
                    <button className={styles.button} onClick={() => handleVerify(session._id)}>Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.pagination}>
        <button className={styles.button} disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page}</span>
        <button className={styles.button} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default UserMobileSessionsAdminPage;
