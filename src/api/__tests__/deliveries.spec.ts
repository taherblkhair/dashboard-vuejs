import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../index', () => ({
  request: vi.fn(),
}))

import { assignRiderToDelivery, updateDeliveryStatus } from '../deliveries'
import { request } from '../index'

describe('deliveries API helpers', () => {
  beforeEach(() => {
    ;(request as any).mockReset()
  })

  it('assignRiderToDelivery should call request with correct args', async () => {
    ;(request as any).mockResolvedValue({ data: { success: true } })
    const res = await assignRiderToDelivery(123, { rider_id: 45 })
    expect(request).toHaveBeenCalledWith('/deliveries/123/assign-rider', {
      method: 'PATCH',
      body: JSON.stringify({ rider_id: 45 }),
    })
    expect(res).toEqual({ data: { success: true } })
  })

  it('updateDeliveryStatus should call request with correct args', async () => {
    ;(request as any).mockResolvedValue({ data: { ok: true } })
    const payload = { status: 'picked_up', notes: 'on the way' }
    const res = await updateDeliveryStatus(9, payload)
    expect(request).toHaveBeenCalledWith('/deliveries/9/update-status', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    expect(res).toEqual({ data: { ok: true } })
  })
})
