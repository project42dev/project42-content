export const fixture = Object.freeze({
  principals: Object.freeze({
    "signed-user-a": Object.freeze({ subject: "user-a", accountId: "acct-a" }),
    "signed-user-b": Object.freeze({ subject: "user-b", accountId: "acct-b" }),
    "signed-supervisor": Object.freeze({ subject: "supervisor", accountId: "acct-b" })
  }),
  orders: Object.freeze([
    Object.freeze({ account_id: "acct-a", order_number: "1042", status: "packed", updated_at: "2026-09-20T10:00:00Z" }),
    Object.freeze({ account_id: "acct-b", order_number: "1042", status: "shipped", updated_at: "2026-09-20T11:00:00Z" }),
    Object.freeze({ account_id: "acct-b", order_number: "9001", status: "processing", updated_at: "2026-09-20T12:00:00Z" })
  ]),
  tickets: Object.freeze([
    Object.freeze({ account_id: "acct-b", ticket_id: "T-7", status: "open" })
  ])
});
