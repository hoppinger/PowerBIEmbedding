using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using PowerBIPoC.Models;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PowerBIPoC.Services
{
  public class UserStore<T> : IUserSecurityStampStore<T>, IUserEmailStore<T> where T: class, IAuthenticationUser
  {
    private bool _disposed;
    private readonly PowerBIPoCContext _context;
    private readonly DbSet<T> _collection;
    public bool AutoSaveChanges { get; set; } = true;

    public UserStore(PowerBIPoCContext context, DbSet<T> collection) {
      _context = context;
      _collection = collection;
    }

    public virtual Task<string> GetSecurityStampAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.SecurityStamp);
    }

    public Task<T> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      return _collection.FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);
    }

    public virtual Task<bool> GetEmailConfirmedAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.EmailConfirmed);
    }

    public virtual Task SetNormalizedEmailAsync(T user, string normalizedEmail, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.Email = normalizedEmail;
      return Task.CompletedTask;
    }

    public virtual Task<string> GetNormalizedEmailAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.Email);
    }

    public virtual Task SetEmailConfirmedAsync(T user, bool confirmed, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.EmailConfirmed = confirmed;
      return Task.CompletedTask;
    }

    public virtual Task SetEmailAsync(T user, string email, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.Email = email;
      return Task.CompletedTask;
    }
    public virtual Task<string> GetEmailAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.Email);
    }


    public virtual Task SetSecurityStampAsync(T user, string stamp, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      if (stamp == null)
      {
        throw new ArgumentNullException(nameof(stamp));
      }
      user.SecurityStamp = stamp;
      return Task.CompletedTask;
    }

    public virtual Task<string> GetUserIdAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(ConvertIdToString(user.Id));
    }

    public Task<T> FindByIdAsync(string userId, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      var id = ConvertIdFromString(userId);
      return _collection.FindAsync(new object[] { id }, cancellationToken);
    }

    public virtual Task<string> GetUserNameAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.Username);
    }

    public virtual Task<string> GetNormalizedUserNameAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.Username);
    }


    public virtual string ConvertIdToString(int id)
    {
      return id.ToString();
    }

    public virtual Task SetUserNameAsync(T user, string userName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.Username = userName;
      return Task.CompletedTask;
    }

    public virtual Task SetNormalizedUserNameAsync(T user, string userName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.Username = userName;
      return Task.CompletedTask;
    }

    public async Task<IdentityResult> DeleteAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }

      _context.Remove(user);
      await SaveChanges(cancellationToken);
      return IdentityResult.Success;
    }

    protected Task SaveChanges(CancellationToken cancellationToken)
    {
      return AutoSaveChanges ? _context.SaveChangesAsync(cancellationToken) : Task.CompletedTask;
    }

    public virtual int ConvertIdFromString(string id)
    {
      if (id == null)
      {
        return default(int);
      }
      return Int32.Parse(id);
    }

    public async Task<IdentityResult> UpdateAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }

      _context.Attach(user);

      _context.Update(user);
      await SaveChanges(cancellationToken);
      return IdentityResult.Success;
    }

    public async Task<IdentityResult> CreateAsync(T user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      _context.Add(user);
      await SaveChanges(cancellationToken);
      return IdentityResult.Success;
    }

    public Task<T> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      return _collection.FirstOrDefaultAsync(u => u.Username == normalizedUserName, cancellationToken);
    }

    internal async Task<byte[]> CreateSecurityTokenAsync(T user)
    {
      return System.Text.Encoding.Unicode.GetBytes(await GetSecurityStampAsync(user));
    }
    public void Dispose()
    {
      _disposed = true;
    }

    protected void ThrowIfDisposed()
    {
      if (_disposed)
      {
        throw new ObjectDisposedException(GetType().Name);
      }
    }

  }
}